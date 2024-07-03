import {
  NextFunction,
  Request,
  Response
} from "express";

export function destroySession(req: Request, res: Response) {
  return;
}

export function send400(req: Request, res: Response) {
  res.send(400);
  res.end();
}

export function sendOK(req: Request, res: Response) {
  res.send(200);
  res.end();
  return;
}

export function sendFile(req: Request, res: Response, pathToFile: string, fileName: string) {
  res.download(pathToFile);
  return;
}

export function endpointNotFound(req: Request, res: Response, next: NextFunction) {
  send400(req, res);
  return;
}

export function sendBadRequest(req: Request, res: Response, err: Error | string) {
  send400(req, res);
  return;
}

export function sendTooManyRequests(req: Request, res: Response, err: Error | string) {
  send400(req, res);
  return;
}

export function sendUnauthorized(req: Request, res: Response, message: string) {
  destroySession(req, res);
  send400(req, res);
  return;
}

export function sendForbidden(req: Request, res: Response, message: string) {
  destroySession(req, res);
  send400(req, res);
  return;
}

export function sendNotFound(req: Request, res: Response, message: string) {
  send400(req, res);
  return;
}

export function sendMethodNotAllowed(req: Request, res: Response, message: string) {
  send400(req, res);
  return;
}

export function handleError(
  req: Request,
  res: Response,
  err: any,
  message?: string,
  code?: number
) {
  return;
}

export class DxRateLimiters {
  public static authLookup() {
    return () => null;
  }
  public static login() {
    return () => null;
  }
  public static standard() {
    return () => null;
  }
  public static strict() {
    return () => null;
  }
  public static veryStrict() {
    return () => null;
  }
}
