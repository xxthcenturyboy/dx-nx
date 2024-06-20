import {
  NextFunction,
  Request,
  Response
} from "express";

export class HttpResponse {
  public sendOk(req: Request, res: Response) {
    return;
  }

  public sendFile(req: Request, res: Response, pathToFile: string, fileName: string) {
    return;
  }

  public endpointNotFound(req: Request, res: Response, next: NextFunction) {
    return;
  }

  public sendBadRequest(req: Request, res: Response, err: Error | string) {
    return;
  }

  public sendUnauthorized(req: Request, res: Response, message: string) {
    return;
  }

  public sendForbidden(req: Request, res: Response, message: string) {
    return;
  }

  public sendNotFound(req: Request, res: Response, message: string) {
    return;
  }

  public sendMethodNotAllowed(req: Request, res: Response, message: string) {
    return;
  }
}
