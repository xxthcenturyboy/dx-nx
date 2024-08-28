import sharp, {
  Metadata
} from 'sharp';
import fs from 'fs';

import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger-api';
import {
  ImageResizeAssetType,
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

  async metaData(imagePath: string | Buffer) {
    const imageMetaData = await sharp(imagePath)
      .metadata()
      .then(function (metadata) {
        return metadata;
      }).catch(err => {
        throw err;
      });

    return imageMetaData;
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
    const dataFiles: ImageResizeAssetType[] = [];
    const originalImageMeta = await this.metaData(filePath);
    const promises = UPLOAD_FILE_SIZES.map(async f => {
      if (f.name !== 'original') {
        const width = originalImageMeta.width && originalImageMeta.width > f.width
          ? f.width
          : originalImageMeta.width;
        const resizedImage = await this.resizeByFileContent(fileContent, width || 0);
        const resizedImageMeta = await this.metaData(resizedImage);

        const imageData: ImageResizeAssetType = {
          asset: resizedImage,
          id: `${fileName}_${f.name}`,
          size: resizedImageMeta.size,
          width: resizedImageMeta.width,
          height: resizedImageMeta.height,
          format: resizedImageMeta.format,
          metaData: this.stringifyMetaForS3(resizedImageMeta)
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
        this.logger.logInfo(`Image Resized to: ${formatBytes(size)}, b64 Size: ${formatBytes(b64Size)}`);
      } catch (err) {
        this.logger.logError(err);
      }
    }
  }
}

export type MediaApiImageManipulationServiceType = typeof MediaApiImageManipulationService.prototype;
