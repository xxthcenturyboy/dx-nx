import {
  Request,
  Response
} from 'express';

import { AuthService } from './auth.service';
import {
  sendBadRequest,
  sendOK
} from '@dx/server';
import {
  AccountCreationPayloadType,
  LoginPaylodType,
  OtpLockoutResponseType,
  UserLookupQueryType
} from '../model/auth.types';
import { TokenService } from './token.service';
import { UserProfileStateType } from '@dx/user';
import { ApiLoggingClass } from '@dx/logger';
import { AUTH_TOKEN_NAMES } from '../model/auth.consts';

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
      const result = await service.createAccount(
        req.body as AccountCreationPayloadType,
        req.session
      ) as UserProfileStateType;

      req.session.userId = result.id;

      const Token = new TokenService(req, res);
      const tokenSetup = await Token.issueAll(result.hasSecuredAccount);
      if (!tokenSetup) {
        throw new Error('Could not create Auth Tokens!');
      }

      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  lockoutFromOtpEmail: async function(req: Request, res: Response) {
    try {
      const { id } = req.body as { id: string };
      const service = new AuthService();
      const result = await service.lockoutFromOtpEmail(id) as OtpLockoutResponseType;

      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  login: async function(req: Request, res: Response) {
    try {
      const service = new AuthService();
      const result = await service.login(req.body as LoginPaylodType) as UserProfileStateType;

      req.session.userId = result.id;

      const Token = new TokenService(req, res);
      const tokenSetup = await Token.issueAll(result.hasSecuredAccount);
      if (!tokenSetup) {
        throw new Error('Could not create Auth Tokens!');
      }

      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  logout: async function(req: Request, res: Response) {
    req.session.destroy((err) => {
      const tokenService = new TokenService(req, res);
      tokenService.invalidateTokens(res);
      if (err) {
        return sendBadRequest(req, res, err.message || 'Failed to destroy session');
      }
      ApiLoggingClass.instance.logInfo(`Session Destroyed: ${req.sessionId}`);
      sendOK(req, res, { loggedOut: true });
    });
  },

  refreshTokens: async function(req: Request, res: Response) {
    const refreshToken = req?.cookies[AUTH_TOKEN_NAMES.REFRESH] as string;
    const isAccountSecured = req?.cookies[AUTH_TOKEN_NAMES.ACCTSECURE] === 'true';
    if (!refreshToken) {
      ApiLoggingClass.instance.logError('No refresh token!');
      return AuthController.logout(req, res);
    }

    const tokenService = new TokenService(req, res);
    if (await tokenService.hasRefreshBeenUsed(refreshToken)) {
      ApiLoggingClass.instance.logError('Token has already been used.');
      return AuthController.logout(req, res);
    }

    const reissued = await tokenService.reissueFromRefresh(refreshToken, isAccountSecured);
    if (!reissued) {
      ApiLoggingClass.instance.logError('Unable to reissue the tokens.');
      return AuthController.logout(req, res);
    }

    sendOK(req, res, 'Tokens Reissued');
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
