import {
  Request,
  Response,
  NextFunction
} from 'express';
import { ApiLoggingClass } from '@dx/logger';
import { TokenService } from './token.service';
import { sendUnauthorized } from '@dx/server';
import { AUTH_TOKEN_NAMES } from '../model/auth.consts';

export async function ensureLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Ensure token is still valid
  try {
    const userId = req.session && req.session.userId;
    // const accountSecured = req?.cookies[AUTH_TOKEN_NAMES.ACCTSECURE];
    // console.log('accountSecured', accountSecured, typeof accountSecured, accountSecured === 'true');
    const refreshToken = req?.cookies[AUTH_TOKEN_NAMES.REFRESH];

    // must have a userID on the session or else
    if (
      !userId
      || !refreshToken
    ) {
      throw new Error('Invalid Session.');
    }

    const tokenService = new TokenService(req, res);
    if (!tokenService.token) {
      throw new Error('No token MOFO');
    }

    const tokenValidated = tokenService.validateToken();
    if (!tokenValidated) {
      throw new Error('Auth Token Invalid');
    }

    if (await tokenService.hasRefreshBeenUsed(refreshToken)) {
      throw new Error('Refresh token is invalid');
    }

    next();
  } catch (err) {
    const msg = err.message || err;
    const token = new TokenService(req, res);
    token.invalidateTokens(res);
    ApiLoggingClass.instance.logError(`Failed to authenticate tokens: ${msg}`);
    sendUnauthorized(req, res, msg);
  }
}
