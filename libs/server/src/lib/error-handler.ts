import {
  Response,
  Request
} from 'express';
import { StatusCodes } from 'http-status-codes';

import { ApiLoggingClass } from '@dx/logger';
import { sendBadRequest, sendForbidden } from './http-responses';

export function handleError(
  req: Request,
  res: Response,
  err: any,
  message?: string,
  code?: number
) {
  if (code) {
    res.status(code);
  } else {
    res.status(400);
  }
  const logger = ApiLoggingClass.instance;

  logger.logError(JSON.stringify(err), err);
  if (message) {
    return sendBadRequest(req, res, message);
  }

  if (
    typeof err === 'object'
    && err !== null
  ) {
    if (
      err.hasOwnProperty('code')
      && err.code === StatusCodes.FORBIDDEN
    ) {
      return sendForbidden(req, res, err.message);
    }

    return sendBadRequest(req, res, err);
  }

  sendBadRequest(req, res, err.message || err);
}
