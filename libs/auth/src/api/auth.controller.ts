import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import {
  sendBadRequest,
  sendOK
} from '@dx/server';
import {
  GetByTokenQueryType,
  SignupPayloadType,
  UserLookupQueryType
} from '../model/auth.types';
import { TokenService } from './token.service';
import { UserProfileStateType } from '@dx/user';

export const AuthController = {
  userLookup: async function(req: Request, res: Response) {
    try {
      const service = new AuthService();
      const result = await service.doesEmailPhoneUsernameExist(req.query as UserLookupQueryType);
      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  getByToken: async function(req: Request, res: Response) {
    try {
      const service = new AuthService();
      const result = await service.getByToken(req.query as GetByTokenQueryType);
      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  signup: async function(req: Request, res: Response) {
    try {
      const service = new AuthService();
      const result = await service.signup(
        req.body as SignupPayloadType,
        req.session
      ) as UserProfileStateType;

      req.session.userId = result.id;

      const Token = new TokenService(req, res);
      const tokenSetup = await Token.issueAll();
      if (!tokenSetup) {
        throw new Error('Could not create Auth Tokens!');
      }

      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  }
};

export type AuthControllerType = typeof AuthController;
