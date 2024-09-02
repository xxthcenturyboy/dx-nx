import { v4 as uuidv4 } from 'uuid';
import { Metadata } from 'sharp';

import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger-api';
import {
  S3Service,
  S3ServiceType
} from '@dx/data-access-s3';
import {
  AssetDataType,
  ASSET_TYPES,
  ASSET_TYPE_BY_MIME_TYPE_MAP,
  ImageResizeAssetType,
  MIME_TYPE_BY_SUB_TYPE,
  S3_BUCKETS,
  UploadAssetHandlerParams
} from '@dx/media-shared';
import { S3_APP_BUCKET_NAME } from '@dx/config-api';
import { stream2buffer } from '@dx/utils-shared-misc';
import { dxHashAnyToString } from '@dx/util-encryption';
import {
  MediaApiImageManipulationService,
  MediaApiImageManipulationServiceType
} from './media-api-image-manipulation.service';
import { Readable } from 'stream';

export class MediaApiService {
  imageManipulationService: MediaApiImageManipulationServiceType;
  logger: ApiLoggingClassType;
  s3Service: S3ServiceType;

  constructor() {
    this.imageManipulationService = new MediaApiImageManipulationService();
    this.logger = ApiLoggingClass.instance;
    this.s3Service = new S3Service();
  }

  public async clearUpload(uploadId?: string) {
    if (!uploadId) {
      return false;
    }

    try {
      const removed = await this.s3Service.emptyS3Directory(
        `${S3_APP_BUCKET_NAME}-${S3_BUCKETS.UPLOAD_TMP}`,
        uploadId
      );
      return removed.removed;
    } catch (err) {
      this.logger.logError(err);
      return false;
    }
  }

  private isFileTypeAllowed(
    assetSubType: string,
    mimetype: string
  ) {
    const allowedTypes = MIME_TYPE_BY_SUB_TYPE[assetSubType];
    if (!Array.isArray(allowedTypes)) {
      return false;
    }
    for (const type of allowedTypes) {
      if (mimetype.search(type) > -1) {
        return true;
      }
    }
    return false;
  }

  public async userContentUpload(
    data: UploadAssetHandlerParams
  ) {
    if (
      !data.assetSubType
      || !data.filePath
      || !data.mimeType
      || !data.ownerId
      || !data.uploadId
    ) {
      await this.clearUpload(data.uploadId);
      throw new Error('102 Missing required data.');
    }

    if (!this.isFileTypeAllowed(data.assetSubType, data.mimeType)) {
      await this.clearUpload(data.uploadId);
      throw new Error('103 Incorrect file type.');
    }
    const id = uuidv4();
    const ASSET_SUB_TYPE = data.assetSubType.toLowerCase();
    const BUCKET = `${S3_APP_BUCKET_NAME}-${S3_BUCKETS.USER_CONTENT}`;
    const KEY = `${data.ownerId}/${ASSET_SUB_TYPE}/${id}`;

    const moved = await this.s3Service.moveObject(
      `/${S3_APP_BUCKET_NAME}-${S3_BUCKETS.UPLOAD_TMP}/${data.uploadId}/${encodeURIComponent(data.originalFilename)}`,
      BUCKET,
      KEY
    );

    if (moved) {
      await this.clearUpload(data.uploadId);
    }

    const assetType = ASSET_TYPE_BY_MIME_TYPE_MAP[data.mimeType];
    const hashedFilenameMimeType = dxHashAnyToString(`${data.originalFilename}${data.mimeType}`);
    const dataFiles: ImageResizeAssetType[] = [];
    let imageMeta: Metadata | null = null;

    const file = await this.s3Service.getObject(
      BUCKET,
      KEY
    );

    switch (assetType) {
      case ASSET_TYPES.ICON:
      case ASSET_TYPES.SVG:
      case ASSET_TYPES.GIF:
        const imageBuffer = await stream2buffer(file as Readable);
        imageMeta = await this.imageManipulationService.getMetaFromBuffer(imageBuffer);
        dataFiles.push({
          asset: await stream2buffer(file as Readable),
          id: `${id}_${assetType}`,
          size: data.fileSize,
          width: imageMeta.width,
          height: imageMeta.height,
          format: imageMeta.format,
        });
        break;
      case ASSET_TYPES.AUDIO:
      case ASSET_TYPES.FONT:
      case ASSET_TYPES.PDF:
      case ASSET_TYPES.VIDEO:
        dataFiles.push({
          asset: await stream2buffer(file as Readable),
          id: `${id}_${assetType}`,
          size: data.fileSize,
          width: 0,
          height: 0,
          format: data.mimeType || ''
        });
        break;
      case ASSET_TYPES.IMAGE: {
        const result = await this.imageManipulationService.resizeImageStream(
          id,
          file as Readable
        );
        dataFiles.push(...result);
        break;
      }
      default:
        throw new Error(`103 Unsupported file uploaded: ${data.mimeType || 'no file type'}.`);
    }

    const s3Promises = dataFiles.map(
      async (file) => await this.s3Service.uploadObject(
        BUCKET,
        `${data.ownerId}/${ASSET_SUB_TYPE}/${file.id}`,
        file.asset as Buffer,
        data.mimeType,
        file.metaData
      )
    );

    const uploads = await Promise.all(s3Promises);
    for (let i = 0, max = uploads.length; i < max; i += 1) {
      dataFiles[i].s3UploadedFile = uploads[i];
    }

    const mediaRecord: AssetDataType = {
      id,
      altText: data.altText,
      assetSubType: ASSET_SUB_TYPE.toUpperCase(),
      assetType: data.mimeType,
      files: [],
      md5FileHash: hashedFilenameMimeType,
      originalFileName: data.originalFilename,
      ownerId: data.ownerId
    };

    for (const dataFile of dataFiles) {
      mediaRecord.files.push({
        size: dataFile.size,
        width: dataFile.width,
        height: dataFile.height,
        format: dataFile.format,
        bucket: dataFile.s3UploadedFile.Bucket,
        key: dataFile.s3UploadedFile.Key,
        location: dataFile.s3UploadedFile.Location,
        eTag: dataFile.s3UploadedFile.ETag
      })
    }

    console.log(mediaRecord);
    // TODO: save to DB
    return mediaRecord;
  }

  public async getUserContent(key: string) {
    try {
      const result = await this.s3Service.getObject(
        `${S3_APP_BUCKET_NAME}-${S3_BUCKETS.USER_CONTENT}`,
        key
      );
      return result;
    } catch (err) {
      this.logger.logError(err);
      throw new Error('105 Could not retrieve file.');
    }
  }
}

export type MediaApiServiceType = typeof MediaApiService.prototype;
