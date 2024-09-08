import {
  Request,
  Response,
  NextFunction
} from 'express';

import { ApiLoggingClass } from '@dx/logger-api';
import { CookeiService } from '@dx/utils-api-cookies';
import { HeaderService } from '@dx/utils-api-headers';
import { sendForbidden } from '@dx/utils-api-http-response';
import { UserModel } from '@dx/user-api';
import { TokenService } from './token.service';
import { AUTH_TOKEN_NAMES } from './auth-api.consts';

export async function ensureLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = HeaderService.getTokenFromRequest(req);
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
    // CookeiService.clearCookies(res);
    ApiLoggingClass.instance.logError(`Failed to authenticate tokens: ${msg}`);
    sendForbidden(req, res, msg);
  }
}

export async function ensureLoggedInMedia(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = CookeiService.getCookie(req, AUTH_TOKEN_NAMES.REFRESH);
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
    // CookeiService.clearCookies(res);
    ApiLoggingClass.instance.logError(`Failed to authenticate tokens: ${msg}`);
    sendForbidden(req, res, msg);
  }
}
