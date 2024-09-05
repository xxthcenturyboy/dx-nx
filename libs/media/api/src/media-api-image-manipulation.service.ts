import sharp, {
  Metadata
} from 'sharp';
import fs from 'fs';
import { Readable } from 'stream';

import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger-api';
import {
  MEDIA_VARIANTS,
  ImageResizeMediaType,
  UPLOAD_FILE_SIZES
} from '@dx/media-shared';
import { formatBytes } from '@dx/util-numbers';
export class MediaApiImageManipulationService {
  logger: ApiLoggingClassType;

  constructor() {
    this.logger = ApiLoggingClass.instance;
  }

  private stringifyMetaForS3(meta: Metadata) {
    const metaKeys = Object.keys(meta);
    const stringified: { [key: string]: string } = {};
    for (const key of metaKeys) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      stringified[key] = typeof meta[key] !== 'string'
        ? String(meta[key])
        : meta[key];
    }
    return stringified;
  }

  public async getMetaFromBuffer(image: string | Buffer) {
    return await sharp(image)
      .metadata()
      .then(function (metadata) {
        return metadata;
      }).catch(err => {
        throw err;
      });
  }

  async resizeByImagePath(imagePath: string, width: number) {
    const fileContent = fs.readFileSync(imagePath);
    const result = await this.resizeByFileContent(fileContent, width);
    return result;
  }

  async resizeByFileContent(fileContent: string | Buffer, width: number) {
    const {
      data
    } = await sharp(fileContent)
      .resize({
        width
      })
      .toBuffer({
        resolveWithObject: true,
      });
    return data;
  }

  async resizeImageToFiles(
    fileName: string,
    filePath: string,
    fileContent: Buffer
  ) {
    const dataFiles: ImageResizeMediaType[] = [];
    const originalImageMeta = await this.getMetaFromBuffer(filePath);
    const promises = UPLOAD_FILE_SIZES.map(async (fileSize) => {
      if (fileSize.name !== MEDIA_VARIANTS.ORIGINAL) {
        const width = originalImageMeta.width && originalImageMeta.width > fileSize.width
          ? fileSize.width
          : originalImageMeta.width;
        const resizedImage = await this.resizeByFileContent(fileContent, width || 0);
        const resizedImageMeta = await this.getMetaFromBuffer(resizedImage);

        const imageData: ImageResizeMediaType = {
          asset: resizedImage,
          id: `${fileName}_${fileSize.name}`,
          size: resizedImageMeta.size,
          width: resizedImageMeta.width,
          height: resizedImageMeta.height,
          format: resizedImageMeta.format,
          metaData: this.stringifyMetaForS3(resizedImageMeta),
          variant: fileSize.name
        };
        dataFiles.push(imageData);
      }
    });

    await Promise.all(promises);
    return dataFiles;
  }

  public async resizeImageStream(
    fileName: string,
    fileContent: Readable
  ) {
    const dataFiles: ImageResizeMediaType[] = [];
    const originalBuffer = await fileContent.pipe(
      await sharp()
    ).toBuffer();
    const originalImageMeta = await this.getMetaFromBuffer(originalBuffer);

    const promises = UPLOAD_FILE_SIZES.map(async (fileSize) => {
      if (fileSize.name === MEDIA_VARIANTS.ORIGINAL) {
        const imageData: ImageResizeMediaType = {
          asset: originalBuffer,
          id: `${fileName}`,
          size: originalImageMeta.size,
          width: originalImageMeta.width,
          height: originalImageMeta.height,
          format: originalImageMeta.format,
          metaData: this.stringifyMetaForS3(originalImageMeta),
          variant: fileSize.name
        };

        dataFiles.push(imageData);
      } else {
        const width = originalImageMeta.width && originalImageMeta.width > fileSize.width
          ? fileSize.width
          : originalImageMeta.width;
        const resizedImage = await this.resizeByFileContent(originalBuffer, width);
        // this.logSizes(originalImageMeta.size, resizedImage);
        const resizedImageMeta = await this.getMetaFromBuffer(resizedImage);

        const imageData: ImageResizeMediaType = {
          asset: resizedImage,
          id: `${fileName}_${fileSize.name}`,
          size: resizedImageMeta.size,
          width: resizedImageMeta.width,
          height: resizedImageMeta.height,
          format: resizedImageMeta.format,
          metaData: this.stringifyMetaForS3(resizedImageMeta),
          variant: fileSize.name
        };

        dataFiles.push(imageData);
      }
    });

    await Promise.all(promises);
    return dataFiles;
  }

  private logSizes(size: number, buffer: Buffer) {
    if (Buffer.isBuffer(buffer)) {
      try {
        const b64 = buffer.toString('base64');
        const lastChar = b64.slice(-2);
        const pad = lastChar === '==' ? 2 : 1;
        const b64Size = (b64.length * (3 / 4)) - pad;
        this.logger.logInfo(`Image Resized from: ${formatBytes(size)}, to b64 Size: ${formatBytes(b64Size)}`);
      } catch (err) {
        this.logger.logError(err);
      }
    }
  }
}

export type MediaApiImageManipulationServiceType = typeof MediaApiImageManipulationService.prototype;
