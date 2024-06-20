import {
  Response,
  Request
} from 'express';
import { StatusCodes } from 'http-status-codes';

import { ApiLoggingClass } from '@dx/logger';
import { HttpResponse } from './http-response';

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
  const response = new HttpResponse;

  logger.logError(JSON.stringify(err), err);
  if (message) {
    return response.sendBadRequest(req, res, message);
  }

  if (
    typeof err === 'object'
    && err !== null
  ) {
    if (
      err.hasOwnProperty('code')
      && err.code === StatusCodes.FORBIDDEN
    ) {
      return response.sendForbidden(req, res, err.message);
    }

    return response.sendBadRequest(req, res, err);
  }

  response.sendBadRequest(req, res, err.message || err);
}
