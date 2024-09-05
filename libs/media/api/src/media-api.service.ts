import { v4 as uuidv4 } from 'uuid';
// import { Metadata } from 'sharp';
import { Readable } from 'stream';

import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger-api';
import {
  S3Service,
  S3ServiceType
} from '@dx/data-access-s3';
import {
  MediaDataType,
  MEDIA_TYPES,
  MEDIA_TYPE_BY_MIME_TYPE_MAP,
  ImageResizeMediaType,
  MIME_TYPE_BY_SUB_TYPE,
  S3_BUCKETS,
  UploadMediaHandlerParams,
  MEDIA_VARIANTS
} from '@dx/media-shared';
import { S3_APP_BUCKET_NAME } from '@dx/config-api';
import { stream2buffer } from '@dx/utils-shared-misc';
import { dxHashAnyToString } from '@dx/util-encryption';
import {
  MediaApiImageManipulationService,
  MediaApiImageManipulationServiceType
} from './media-api-image-manipulation.service';
import { MediaModel } from './media-api.postgres-model';

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
    mediaSubType: string,
    mimetype: string
  ) {
    const allowedTypes = MIME_TYPE_BY_SUB_TYPE[mediaSubType];
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

  private async processFile(
    mediaType: string,
    data: UploadMediaHandlerParams,
    file: Readable,
    id: string
  ) {
    switch (mediaType) {
      case MEDIA_TYPES.ICON:
      case MEDIA_TYPES.SVG:
      case MEDIA_TYPES.GIF:
        const imageBuffer = await stream2buffer(file);
        const imageMeta = await this.imageManipulationService.getMetaFromBuffer(imageBuffer);
        return [{
          asset: await stream2buffer(file),
          id: `${id}_${mediaType}`,
          size: data.fileSize,
          width: imageMeta.width,
          height: imageMeta.height,
          format: imageMeta.format,
          variant: MEDIA_VARIANTS.ORIGINAL
        }];
      case MEDIA_TYPES.AUDIO:
      case MEDIA_TYPES.FONT:
      case MEDIA_TYPES.PDF:
      case MEDIA_TYPES.VIDEO:
        return [{
          asset: await stream2buffer(file),
          id: `${id}_${mediaType}`,
          size: data.fileSize,
          width: 0,
          height: 0,
          format: data.mimeType || '',
          variant: MEDIA_VARIANTS.ORIGINAL
        }];
      case MEDIA_TYPES.IMAGE: {
        return await this.imageManipulationService.resizeImageStream(id, file);
      }
      default:
        throw new Error(`103 Unsupported file uploaded: ${data.mimeType || 'no file type'}.`);
    }
  }

  public async userContentUpload(
    data: UploadMediaHandlerParams
  ) {
    if (
      !data.mediaSubType
      || !data.filePath
      || !data.mimeType
      || !data.ownerId
      || !data.uploadId
    ) {
      await this.clearUpload(data.uploadId);
      throw new Error('102 Missing required data.');
    }

    if (!this.isFileTypeAllowed(data.mediaSubType, data.mimeType)) {
      await this.clearUpload(data.uploadId);
      throw new Error('103 Incorrect file type.');
    }
    const id = uuidv4();
    const ASSET_SUB_TYPE = data.mediaSubType.toLowerCase();
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

    const mediaType = MEDIA_TYPE_BY_MIME_TYPE_MAP[data.mimeType];
    const hashedFilenameMimeType = dxHashAnyToString(`${data.originalFilename}${data.mimeType}`);

    const file = await this.s3Service.getObject(
      BUCKET,
      KEY
    );

    const processedFiles: ImageResizeMediaType[] = await this.processFile(mediaType, data, file as Readable, id);

    const s3Promises = processedFiles.map(
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
      processedFiles[i].s3UploadedFile = uploads[i];
    }

    const mediaRecord: MediaDataType = {
      id,
      altText: data.altText,
      mediaSubType: ASSET_SUB_TYPE.toUpperCase(),
      mediaType: data.mimeType,
      files: {},
      hashedFilenameMimeType: hashedFilenameMimeType,
      originalFileName: data.originalFilename,
      ownerId: data.ownerId,
      primary: data.isPrimary
    };

    for (const processedFile of processedFiles) {
      mediaRecord.files[processedFile.variant] = {
        size: processedFile.size,
        width: processedFile.width,
        height: processedFile.height,
        format: processedFile.format,
        bucket: processedFile.s3UploadedFile.Bucket,
        key: processedFile.s3UploadedFile.Key,
        location: processedFile.s3UploadedFile.Location,
        eTag: processedFile.s3UploadedFile.ETag
      };
    }

    try {
      const saveResult = await MediaModel.createNewProfileMedia(mediaRecord);
      return saveResult;
    } catch (err) {
      this.logger.logError(err);
      throw new Error((err as Error).message);
    }
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
