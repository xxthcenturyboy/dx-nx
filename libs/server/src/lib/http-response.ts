import {
  getReasonPhrase,
  StatusCodes
} from 'http-status-codes';
import {
  Request,
  Response,
  NextFunction
} from 'express';

import { ApiLoggingClass, ApiLoggingClassType } from '@dx/logger';
import { TokenService } from '@dx/auth';

export class HttpResponse {
  logger: ApiLoggingClassType;

  constructor() {
    this.logger = ApiLoggingClass.instance;
  }

  private destroySession(req: Request, res: Response) {
    const token = new TokenService(req, res);
    token.invalidateTokens(res);
    req.session?.destroy(() => null);
  }

  private send400(res: Response, data: any): void {
    res.status(data.status).send(data).end();
  }

  public sendOK(req: Request, res: Response, data: any): void {
    res.status(StatusCodes.OK).send(data).end();
  }

  public sendFile(req: Request, res: Response, pathToFile: string, fileName: string): void {
    res.download(pathToFile, fileName, (err) => {
      if (err) {
        this.logger.logError('Send file error', err);
      }
      this.logger.logInfo(`File sent to client: ${fileName}`);
    });
  }

  public endpointNotFound(req: Request, res: Response, next: NextFunction): void {
    this.logger.logError(`Endpoint not found: ${req.url}`);
    this.sendMethodNotAllowed(req, res, 'API endpoint not found');
  }

  public sendBadRequest(req: Request, res: Response, err: Error | string): void {
    const message = typeof err === 'string' ? err : err && err.message;
    this.send400(res, {
      description: getReasonPhrase(StatusCodes.BAD_REQUEST),
      status: StatusCodes.BAD_REQUEST,
      message,
      url: req.url
    });
  }

  public sendUnauthorized(req: Request, res: Response, message: string) {
    this.logger.logWarn(`Unauthorized: ${req.url}, sessionID: ${req.sessionId}`);
    this.destroySession(req, res);
    this.send400(res, {
      description: getReasonPhrase(StatusCodes.UNAUTHORIZED),
      status: StatusCodes.UNAUTHORIZED,
      message,
      url: req.url
    });
  }

  public sendForbidden(req: Request, res: Response, message: string): void {
    this.logger.logWarn(`Forbidden: ${req.url}, sessionId: ${req.sessionId}`);
    this.destroySession(req, res);
    this.send400(res, {
      description: getReasonPhrase(StatusCodes.FORBIDDEN),
      status: StatusCodes.FORBIDDEN,
      message,
      url: req.url
    });
  }

  public sendNotFound(req: Request, res: Response, message: string): void {
    this.logger.logWarn(`Not Found: ${req.url}`);
    this.send400(res, {
      description: getReasonPhrase(StatusCodes.NOT_FOUND),
      status: StatusCodes.NOT_FOUND,
      message,
      url: req.url
    });
  }

  public sendMethodNotAllowed(req: Request, res: Response, message: string): void {
    this.logger.logWarn(`No Method: ${req.url}`);
    this.send400(res, {
      description: getReasonPhrase(StatusCodes.METHOD_NOT_ALLOWED),
      status: StatusCodes.METHOD_NOT_ALLOWED,
      message,
      url: req.url
    });
  }
}
