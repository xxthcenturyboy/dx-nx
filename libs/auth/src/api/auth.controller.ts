import {
  Request,
  Response
} from 'express';

import { AuthService } from './auth.service';
import {
  sendBadRequest,
  sendOK,
  sendNoContent,
  sendUnauthorized
} from '@dx/server';
import {
  AccountCreationPayloadType,
  LoginPaylodType,
  UserLookupQueryType
} from '../model/auth.types';
import { TokenService } from './token.service';
import { CookeiService } from '@dx/server';
import { UserProfileStateType } from '@dx/user';
import { ApiLoggingClass } from '@dx/logger';
import { AUTH_TOKEN_NAMES } from '../model/auth.consts';
import { UserModel } from '@dx/user';

export const AuthController = {
  authLookup: async function(req: Request, res: Response) {
    try {
      const service = new AuthService();
      const result = await service.doesEmailPhoneExist(req.query as UserLookupQueryType);
      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  createAccount: async function(req: Request, res: Response) {
    try {
      const service = new AuthService();
      const profile = await service.createAccount(
        req.body as AccountCreationPayloadType,
        req.session
      ) as UserProfileStateType;

      req.session.userId = profile.id;

      const tokens = TokenService.generateTokens(profile.id);
      if (tokens.refreshToken) {
        CookeiService.setCookies(res, profile.hasSecuredAccount, tokens.refreshToken, tokens.refreshTokenExp);
        await UserModel.updateRefreshToken(profile.id, tokens.refreshToken, true);
      }

      sendOK(req, res, {
        profile,
        token: tokens.accessToken
      });
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  login: async function(req: Request, res: Response) {
    try {
      const service = new AuthService();
      const profile = await service.login(req.body as LoginPaylodType) as UserProfileStateType;

      req.session.userId = profile.id;

      const tokens = TokenService.generateTokens(profile.id);
      if (tokens.refreshToken) {
        CookeiService.setCookies(res, profile.hasSecuredAccount, tokens.refreshToken, tokens.refreshTokenExp);
        await UserModel.updateRefreshToken(profile.id, tokens.refreshToken, true);
      }

      sendOK(req, res, {
        profile,
        token: tokens.accessToken
      });
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  logout: async function(req: Request, res: Response) {
    try {
      const refreshToken = CookeiService.getCookie(req, AUTH_TOKEN_NAMES.REFRESH);
      CookeiService.clearCookies(res);
      if (!refreshToken) {
        return sendNoContent(req, res, '');
      }
      const service = new AuthService();
      const result = await service.logout(refreshToken);
      if (!result) {
        return sendNoContent(req, res, '');
      }

      req.session.destroy((err: Error) => {
        if (err) {
          return sendBadRequest(req, res, err.message || 'Failed to destroy session');
        }
        ApiLoggingClass.instance.logInfo(`Session Destroyed: ${req.sessionId}`);
      });

      sendOK(req, res, { loggedOut: true });
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  refreshTokens: async function(req: Request, res: Response) {
    const refreshToken = CookeiService.getCookie(req, AUTH_TOKEN_NAMES.REFRESH);
    if (!refreshToken) {
      ApiLoggingClass.instance.logError('No refresh token.');
      CookeiService.clearCookies(res);
      req.session.destroy((err: Error) => {
        if (err) {
          return sendBadRequest(req, res, err.message || 'Failed to destroy session');
        }
        ApiLoggingClass.instance.logInfo(`Session Destroyed: ${req.sessionId}`);
      });
      return sendUnauthorized(req, res, 'no refresh token.');
    }

    CookeiService.clearCookie(res, AUTH_TOKEN_NAMES.REFRESH);

    const userId = await TokenService.isRefreshValid(refreshToken);
    if (!userId) {
      return sendUnauthorized(req, res, 'Invalid token.');
    }

    const tokens = TokenService.generateTokens(userId as string);
    if (tokens.refreshToken) {
      const accountSecured = req?.cookies[AUTH_TOKEN_NAMES.ACCTSECURE];
      CookeiService.setCookies(res, accountSecured === 'true', tokens.refreshToken, tokens.refreshTokenExp);
      try {
        await UserModel.updateRefreshToken(userId as string, tokens.refreshToken);
        return sendOK(req, res, {
          accessToken: tokens.accessToken
        });
      } catch (err) {
        ApiLoggingClass.instance.logError(err);
      }
    }

    sendBadRequest(req, res, 'Could not refresh the token.');
  },

  sendOtpToEmail: async function(req: Request, res: Response) {
    try {
      const { email } = req.body as { email: string };
      const service = new AuthService();
      const result = await service.sendOtpToEmail(email);

      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  sendOtpToPhone: async function(req: Request, res: Response) {
    try {
      const { phone, region } = req.body as { phone: string, region?: string };
      const service = new AuthService();
      const result = await service.sendOtpToPhone(phone, region);

      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  validateEmail: async function(req: Request, res: Response) {
    try {
      const { token } = req.params as { token: string };
      const service = new AuthService();
      const result = await service.validateEmail(token);

      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  }
};

export type AuthControllerType = typeof AuthController;
