import {
  Request as IRequest,
  Response as IResponse
} from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { AuthController } from './auth.controller';
import {
  GetByTokenQueryType,
  LoginPaylodType,
  SetupPasswordsPaylodType,
  SignupPayloadType,
  UserLookupQueryType
} from '../model/auth.types';
import { USER_LOOKUPS } from '../model/auth.consts';
import {
  sendOK,
  sendBadRequest
} from '@dx/server';
import { ApiLoggingClass } from '@dx/logger';

jest.mock('./auth.service.ts');
jest.mock('./token.service.ts');
jest.mock('@dx/logger');
jest.mock('@dx/server', () => ({
  sendOK: jest.fn(),
  sendBadRequest: jest.fn()
}));

describe('AuthController', () => {
  let req: IRequest;
  let res: IResponse;

  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Testing' });
  });

  beforeEach(() => {
    req = new Request() as unknown as IRequest;
    res = new Response() as unknown as IResponse;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(AuthController).toBeDefined();
  });

  it('should have userLookup method when instantiated', () => {
    // arrange
    // act
    // assert
    expect(AuthController.userLookup).toBeDefined();
  });

  describe('getByToken', () => {
    test('should sendOk when invoked', async () => {
      // arrange
      const query: GetByTokenQueryType = {
        token: '413c78fb890955a86d3971828dd05a9b2d844e44d8a30d406f80bf6e79612bb97e8b3b5834c8dbebdf5c4dadc767a579'
      };
      req.query = query;
      // act
      await AuthController.getByToken(req, res);
      // assert
      expect(sendOK).toHaveBeenCalled();
    });
  });

  describe('lockoutFromOtpEmail', () => {
    test('should sendOk when invoked', async () => {
      // arrange
      const body = {
        id: '4d2269d3-9bfc-4f2d-b66c-ab63ea1d2c6f'
      };
      req.body = body;
      // act
      await AuthController.lockoutFromOtpEmail(req, res);
      // assert
      expect(sendOK).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    test('should sendBadRequest when invoked', async () => {
      // arrange
      const body: LoginPaylodType = {
        email: 'test@email.com',
        password: 'password'
      };
      req.body = body;
      // act
      await AuthController.login(req, res);
      // assert
      expect(sendBadRequest).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    test('should sendOk when invoked', async () => {
      // arrange
      req.session = {
        destroy: jest.fn()
      };
      // act
      await AuthController.logout(req, res);
      // assert
      expect(req.session.destroy).toHaveBeenCalled();
    });
  });

  describe('refreshTokens', () => {
    test('should sendOk when invoked', async () => {
      // arrange
      req.session = {
        destroy: jest.fn(),
      };
      req.cookies = {
        refresh: 'test-refresh-token'
      };
      // act
      await AuthController.refreshTokens(req, res);
      // assert
      expect(req.session.destroy).toHaveBeenCalled();
    });
  });

  describe('requestReset', () => {
    test('should sendOk when invoked', async () => {
      // arrange
      const body = {
        email: 'test@email.com'
      };
      req.body = body;
      // act
      await AuthController.requestReset(req, res);
      // assert
      expect(sendOK).toHaveBeenCalled();
    });
  });

  describe('setupPasswords', () => {
    test('should sendOk when invoked', async () => {
      // arrange
      const body: SetupPasswordsPaylodType = {
        id: '4d2269d3-9bfc-4f2d-b66c-ab63ea1d2c6f',
        password: 'password',
        securityAA: 'Answer',
        securityQQ: 'Question'
      };
      req.body = body;
      // act
      await AuthController.setupPasswords(req, res);
      // assert
      expect(sendBadRequest).toHaveBeenCalled();
    });
  });

  describe('signup', () => {
    test('should sendOk when invoked', async () => {
      // arrange
      const body: SignupPayloadType = {
        email: 'test@email.com',
        password: 'password',
        passwordConfirm: 'password'
      };
      req.body = body;
      // act
      await AuthController.signup(req, res);
      // assert
      expect(sendBadRequest).toHaveBeenCalled();
    });
  });

  describe('userLookup', () => {
    test('should sendOK when invoked', async () => {
      // arrange
      const query: UserLookupQueryType = {
        value: 'admin',
        type: USER_LOOKUPS.USERNAME
      };
      req.query = query;
      // act
      await AuthController.userLookup(req, res);
      // assert
      expect(sendOK).toHaveBeenCalled();
    });
  });
});
