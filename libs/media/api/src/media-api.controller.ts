import {
  NextFunction,
  Request,
  Response
} from 'express';

import {
  MEDIA_SUB_TYPES,
  UploadMediaHandlerParams
} from '@dx/media-shared';
import { MediaApiService } from './media-api.service';
import {
  sendOK,
  send400,
  sendBadRequest
} from '@dx/utils-api-http-response';
import { StatusCodes } from 'http-status-codes';

export const MediaApiController = {
  getMedia: async function (req: Request, res: Response, next: NextFunction) {
    const { id, size } = req.params as { id: string, size: string };

    try {
      const service = new MediaApiService();
      const key = await service.getContentKey(id, size);
      if (!key) {
        return sendOK(req, res, null);
      }
      await service.getUserContent(key, res)
    } catch (err) {
      sendBadRequest(req, res, (err as Error).message);
    }

  },

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

    const data: UploadMediaHandlerParams = {
      altText: '',
      mediaSubType: '',
      filePath: '',
      fileSize: 0,
      isPrimary: false,
      mimeType: '',
      ownerId: req.user?.id || 'missing-user-id',
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
      if (key === 'mediaSubType') {
        data.mediaSubType = value;
        if (value === MEDIA_SUB_TYPES.PROFILE_IMAGE) {
          data.isPrimary = true;
        }
        continue;
      }
      if (
        key === 'isPrimary'
        && !data.isPrimary
      ) {
        data.isPrimary = typeof value === 'string'
          ? value === 'true'
          : false;
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
