import {
  Request,
  Response,
  NextFunction
} from 'express';
import { Handshake } from 'socket.io/dist/socket';

import { ApiLoggingClass } from '@dx/logger-api';
// import { CookeiService } from '@dx/utils-api-cookies';
import { HeaderService } from '@dx/utils-api-headers';
import { sendForbidden } from '@dx/utils-api-http-response';
import { UserModel } from '@dx/user-api';
import { TokenService } from './token.service';

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

export function ensureLoggedInSocket(handshake: Handshake) {
  try {
    const token = HeaderService.getTokenFromHandshake(handshake);
    if (!token) {
      throw new Error('No Token.');
    }

    const userId = TokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new Error('Token invalid or expired.');
    }

    return true;
  } catch (err) {
    const msg = err.message || err;
    ApiLoggingClass.instance.logError(`Failed to authenticate socket token: ${msg}`);
    return false;
  }
}
