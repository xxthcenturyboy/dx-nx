import {
  NextFunction,
  Request,
  Response
} from 'express';

// import { ApiLoggingClass } from '@dx/logger-api';
// import { S3Service } from '@dx/data-access-s3';
import { sendOK, send400 } from '@dx/utils-api-http-response';
import { StatusCodes } from 'http-status-codes';

export const MediaApiController = {
  uploadFile: async function (req: Request, res: Response, next: NextFunction) {
    if (req.uploads.err) {
      send400(res, {
        status: req.uploads?.err?.httpCode || StatusCodes.BAD_REQUEST,
        message: req.uploads?.err?.message || ''
      });
      return;
    }

    const keys = Object.keys(req.uploads);
    for (const key of keys) {
      const value = req.uploads[key][0];
      if (Object.hasOwnProperty.call(value, 'filepath')) {
        console.debug(value.filepath);
      } else {
        console.debug(key, value);
      }

    }
    sendOK(req, res, req.uploads);
  },
};

export type MediaApiControllerType = typeof MediaApiController;
