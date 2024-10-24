import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import { ApiLoggingClass } from '@dx/logger-api';
// import { CookeiService } from '@dx/utils-api-cookies';

// export function destroySession(req: Request, res: Response) {
//   CookeiService.clearCookies(res);
//   req.session?.destroy(() => null);
// }

export function send400(res: Response, data: any): void {
  res.status(data.status).send(data).end();
}

export function sendOK(req: Request, res: Response, data: any): void {
  res.status(StatusCodes.OK).send(data).end();
}

export function sendNoContent(req: Request, res: Response, data: any): void {
  res.status(StatusCodes.NO_CONTENT).send(data).end();
}

export function sendFile(
  req: Request,
  res: Response,
  pathToFile: string,
  fileName: string
): void {
  res.download(pathToFile, fileName, (err) => {
    if (err) {
      ApiLoggingClass.instance.logError('Send file error', err);
    }
    ApiLoggingClass.instance.logInfo(`File sent to client: ${fileName}`);
  });
}

export function sendMethodNotAllowed(
  req: Request,
  res: Response,
  message: string
): void {
  ApiLoggingClass.instance.logWarn(`No Method: ${req.method} ${req.url}`);
  send400(res, {
    description: getReasonPhrase(StatusCodes.METHOD_NOT_ALLOWED),
    status: StatusCodes.METHOD_NOT_ALLOWED,
    message,
    url: req.url,
  });
}

export function sendTooManyRequests(
  req: Request,
  res: Response,
  message: string
): void {
  ApiLoggingClass.instance.logWarn(
    `Too many requests: ${req.method} ${req.url}`
  );
  send400(res, {
    description: getReasonPhrase(StatusCodes.TOO_MANY_REQUESTS),
    status: StatusCodes.TOO_MANY_REQUESTS,
    message,
    url: req.url,
  });
}

export function endpointNotFound(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  ApiLoggingClass.instance.logError(
    `Endpoint not found: ${req.method} ${req.url}`
  );
  send400(res, {
    description: getReasonPhrase(StatusCodes.METHOD_NOT_ALLOWED),
    status: StatusCodes.METHOD_NOT_ALLOWED,
    message: 'API endpoint not found.',
    url: req.url,
  });
}

export function sendBadRequest(
  req: Request,
  res: Response,
  err: Error | string
): void {
  const message = typeof err === 'string' ? err : err && err.message;
  send400(res, {
    description: getReasonPhrase(StatusCodes.BAD_REQUEST),
    status: StatusCodes.BAD_REQUEST,
    message,
    url: req.url,
  });
}

export function sendUnauthorized(req: Request, res: Response, message: string) {
  ApiLoggingClass.instance.logWarn(
    `Unauthorized: ${req.url}, userId: ${req.user?.id || 'unavailable'}`
  );
  // destroySession(req, res);
  // CookeiService.clearCookies(res);
  send400(res, {
    description: getReasonPhrase(StatusCodes.UNAUTHORIZED),
    status: StatusCodes.UNAUTHORIZED,
    message,
    url: req.url,
  });
}

export function sendForbidden(
  req: Request,
  res: Response,
  message: string
): void {
  ApiLoggingClass.instance.logWarn(
    `Forbidden: ${req.url}, userId: ${req.user?.id || 'unavailable'}`
  );
  // destroySession(req, res);
  // CookeiService.clearCookies(res);
  send400(res, {
    description: getReasonPhrase(StatusCodes.FORBIDDEN),
    status: StatusCodes.FORBIDDEN,
    message,
    url: req.url,
  });
}

export function sendNotFound(
  req: Request,
  res: Response,
  message: string
): void {
  ApiLoggingClass.instance.logWarn(`Not Found: ${req.url}`);
  send400(res, {
    description: getReasonPhrase(StatusCodes.NOT_FOUND),
    status: StatusCodes.NOT_FOUND,
    message,
    url: req.url,
  });
}
