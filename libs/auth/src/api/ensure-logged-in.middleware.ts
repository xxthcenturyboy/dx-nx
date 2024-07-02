import {
  Request,
  Response,
  NextFunction
} from 'express';
import { ApiLoggingClass } from '@dx/logger';
import { TokenService } from './token.service';
import {
  CookeiService,
  HeaderService,
  sendUnauthorized
} from '@dx/server';
import { UserModel } from '@dx/user';

export async function ensureLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = HeaderService.getTokenFromAuthHeader(req);
    if (!token) {
      throw new Error('No Token.');
    }

    const userId = TokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new Error('Token invalid or expired.');
    }

    req.user = await UserModel.getUserSessionData(userId);

    next();
  } catch (err) {
    const msg = err.message || err;
    CookeiService.clearCookies(res);
    ApiLoggingClass.instance.logError(`Failed to authenticate tokens: ${msg}`);
    sendUnauthorized(req, res, msg);
  }
}
