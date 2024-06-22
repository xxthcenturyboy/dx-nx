import {
  Request,
  Response,
  NextFunction
} from 'express';
import { ApiLoggingClass } from '@dx/logger';
import { TokenService } from './token.service';
import { HttpResponse } from '@dx/server';

export async function ensureLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Ensure token is still valid
  try {
    const userId = req.session && req.session.userId;
    const refreshToken = req?.cookies?.refresh as string;

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
    const httpResponse = new HttpResponse();
    httpResponse.sendUnauthorized(req, res, msg);
  }
}
