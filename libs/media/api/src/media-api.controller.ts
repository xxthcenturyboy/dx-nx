import {
  NextFunction,
  Request,
  Response
} from 'express';

import { UploadAssetHandlerParams } from '@dx/media-shared';
import { MediaApiService } from './media-api.service';
import {
  sendOK,
  send400,
  sendBadRequest
} from '@dx/utils-api-http-response';
import { StatusCodes } from 'http-status-codes';

export const MediaApiController = {
  uploadUserContent: async function (req: Request, res: Response, next: NextFunction) {
    if (req.uploads.err) {
      const service = new MediaApiService();
      await service.clearUpload(req.uploads.uploadId);

      send400(res, {
        status: req.uploads?.err?.httpCode || StatusCodes.BAD_REQUEST,
        message: req.uploads?.err?.message || ''
      });
      return;
    }

    const data: UploadAssetHandlerParams = {
      altText: '',
      assetSubType: '',
      filePath: '',
      fileSize: 0,
      mimeType: '',
      ownerId: req.user?.id || 'some-user-id',
      originalFilename: '',
      newFilename: '',
      uploadId: req.uploads?.uploadId
    };

    const keys = Object.keys(req.uploads);
    for (const key of keys) {
      const value = req.uploads[key][0];
      if (key === 'altText') {
        data.altText = value;
        continue;
      }
      if (key === 'assetSubType') {
        data.assetSubType = value;
        continue;
      }
      if (Object.hasOwnProperty.call(value, 'filepath')) {
        data.filePath = value.filepath;
      }
      if (Object.hasOwnProperty.call(value, 'mimetype')) {
        data.mimeType = value.mimetype;
      }
      if (Object.hasOwnProperty.call(value, 'size')) {
        data.fileSize = value.size;
      }
      if (Object.hasOwnProperty.call(value, 'originalFilename')) {
        data.originalFilename = value.originalFilename;
      }
      if (Object.hasOwnProperty.call(value, 'newFilename')) {
        data.newFilename = value.newFilename;
      }
    }

    try {
      const service = new MediaApiService();
      const result = await service.userContentUpload(data);

      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err);
    }
  },
};

export type MediaApiControllerType = typeof MediaApiController;
