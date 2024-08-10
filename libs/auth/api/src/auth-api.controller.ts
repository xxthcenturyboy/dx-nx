import { Request, Response } from 'express';

import {
  sendBadRequest,
  sendOK,
  sendNoContent,
  sendUnauthorized,
} from '@dx/utils-api-http-response';
import { DevicesService } from '@dx/devices-api';
import { CookeiService } from '@dx/utils-api-cookies';
import { UserProfileStateType } from '@dx/user-shared';
import { ApiLoggingClass } from '@dx/logger-api';
import { UserModel } from '@dx/user-api';
import { AuthService } from './auth-api.service';
import { AUTH_TOKEN_NAMES } from './auth-api.consts';
import {
  AccountCreationPayloadType,
  LoginPayloadType,
  UserLookupQueryType
} from '@dx/auth-shared';
import { TokenService } from './token.service';

export const AuthController = {
  authLookup: async function (req: Request, res: Response) {
    try {
      const service = new AuthService();
      const result = await service.doesEmailPhoneExist(
        req.query as UserLookupQueryType
      );
      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  createAccount: async function (req: Request, res: Response) {
    try {
      const service = new AuthService();
      const profile = (await service.createAccount(
        req.body as AccountCreationPayloadType
        // req.session
      )) as UserProfileStateType;

      const tokens = TokenService.generateTokens(profile.id);
      if (tokens.refreshToken) {
        CookeiService.setCookies(
          res,
          profile.hasSecuredAccount,
          tokens.refreshToken,
          tokens.refreshTokenExp
        );
        await UserModel.updateRefreshToken(
          profile.id,
          tokens.refreshToken,
          true
        );
      }

      sendOK(req, res, {
        profile,
        accessToken: tokens.accessToken,
      });
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  login: async function (req: Request, res: Response) {
    try {
      const service = new AuthService();
      const profile = (await service.login(
        req.body as LoginPayloadType
      )) as UserProfileStateType;

      const tokens = TokenService.generateTokens(profile.id);
      if (tokens.refreshToken) {
        CookeiService.setCookies(
          res,
          profile.hasSecuredAccount,
          tokens.refreshToken,
          tokens.refreshTokenExp
        );
        await UserModel.updateRefreshToken(
          profile.id,
          tokens.refreshToken,
          true
        );
      }

      sendOK(req, res, {
        profile,
        accessToken: tokens.accessToken,
      });
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  logout: async function (req: Request, res: Response) {
    try {
      const refreshToken = CookeiService.getCookie(
        req,
        AUTH_TOKEN_NAMES.REFRESH
      );
      CookeiService.clearCookies(res);
      if (!refreshToken) {
        return sendOK(req, res, { loggedOut: true });
      }
      const service = new AuthService();
      const result = await service.logout(refreshToken);
      if (!result) {
        return sendOK(req, res, { loggedOut: false });
      }

      // req.session.destroy((err: Error) => {
      //   if (err) {
      //     return sendBadRequest(req, res, err.message || 'Failed to destroy session');
      //   }
      //   ApiLoggingClass.instance.logInfo(`Session Destroyed: ${req.user?.id}`);
      // });

      sendOK(req, res, { loggedOut: true });
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  refreshTokens: async function (req: Request, res: Response) {
    const refreshToken = CookeiService.getCookie(req, AUTH_TOKEN_NAMES.REFRESH);
    if (!refreshToken) {
      ApiLoggingClass.instance.logError('No refresh token.');
      CookeiService.clearCookies(res);
      // req.session.destroy((err: Error) => {
      //   if (err) {
      //     return sendBadRequest(req, res, err.message || 'Failed to destroy session');
      //   }
      //   ApiLoggingClass.instance.logInfo(`Session Destroyed: ${req.sessionId}`);
      // });
      return sendUnauthorized(req, res, 'No refresh token.');
    }

    const userId = await TokenService.isRefreshValid(refreshToken);
    if (!userId) {
      CookeiService.clearCookie(res, AUTH_TOKEN_NAMES.REFRESH);
      return sendUnauthorized(req, res, 'Invalid token.');
    }

    const tokens = TokenService.generateTokens(userId as string);
    if (tokens.refreshToken) {
      CookeiService.setRefreshCookie(
        res,
        tokens.refreshToken,
        tokens.refreshTokenExp
      );
      try {
        await UserModel.updateRefreshToken(
          userId as string,
          tokens.refreshToken
        );
        return sendOK(req, res, {
          accessToken: tokens.accessToken,
        });
      } catch (err) {
        ApiLoggingClass.instance.logError(err);
      }
    }

    sendBadRequest(req, res, 'Could not refresh the token.');
  },

  rejectDevice: async function (req: Request, res: Response) {
    try {
      const service = new DevicesService();
      const { token } = req.params as { token: string };
      const result = await service.rejectDevice(token);
      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  sendOtpToEmail: async function (req: Request, res: Response) {
    try {
      const { email } = req.body as { email: string };
      const service = new AuthService();
      const result = await service.sendOtpToEmail(email);

      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  sendOtpToPhone: async function (req: Request, res: Response) {
    try {
      const { phone, regionCode } = req.body as { phone: string; regionCode?: string };
      const service = new AuthService();
      const result = await service.sendOtpToPhone(phone, regionCode);

      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  validateEmail: async function (req: Request, res: Response) {
    try {
      const { token } = req.params as { token: string };
      const service = new AuthService();
      const result = await service.validateEmail(token);

      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },
};

export type AuthControllerType = typeof AuthController;
