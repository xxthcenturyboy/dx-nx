import {
  NextFunction,
  Request,
  Response
} from "express";

export class DxRateLimiters {
  public static accountCreation() {
    return () => null
  }
  public static authLookup(req: Request, res: Response, next: NextFunction) {
    return () => next();
  }
  public static login() {
    return () => null
  }
  public static standard() {
    return () => null
  }
  public static strict() {
    return () => null
  }
  public static veryStrict() {
    return () => null
  }
}
