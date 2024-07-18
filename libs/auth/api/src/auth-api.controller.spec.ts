import { Request as IRequest, Response as IResponse } from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import {
  sendOK,
  sendBadRequest,
  sendNoContent,
  sendUnauthorized,
} from '@dx/utils-api-http-response';
import { ApiLoggingClass } from '@dx/logger-api';
import { TEST_EMAIL, TEST_PASSWORD } from '@dx/config-shared';
import { AuthController } from './auth-api.controller';
import { LoginPaylodType } from './auth-api.types';

jest.mock('./auth-api.service.ts');
jest.mock('./token.service.ts');
jest.mock('@dx/logger-api');
jest.mock('@dx/utils-api-http-response', () => ({
  sendOK: jest.fn(),
  sendBadRequest: jest.fn(),
  sendNoContent: jest.fn(),
  sendUnauthorized: jest.fn(),
}));
jest.mock('@dx/utils-api-cookies', () => ({
  CookeiService: {
    clearCookie: jest.fn(),
    clearCookies: jest.fn(),
    getCookie: jest.fn(),
    setCookie: jest.fn(),
    setCookies: jest.fn(),
  },
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

  it('should have authLookup method when instantiated', () => {
    // arrange
    // act
    // assert
    expect(AuthController.authLookup).toBeDefined();
  });

  describe('login', () => {
    test('should sendBadRequest when invoked', async () => {
      // arrange
      const body: LoginPaylodType = {
        value: TEST_EMAIL,
        password: TEST_PASSWORD,
      };
      req.body = body;
      // act
      await AuthController.login(req, res);
      // assert
      expect(sendBadRequest).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    test('should sendNoContent when invoked', async () => {
      // arrange
      // req.session = {
      //   destroy: jest.fn()
      // };
      // act
      await AuthController.logout(req, res);
      // assert
      expect(sendNoContent).toHaveBeenCalled();
    });
  });

  describe('rejectDevice', () => {
    it('should exist', () => {
      // arrange
      // act
      // assert
      expect(AuthController.rejectDevice).toBeDefined();
    });
    test('should rejectDevice when invoked', async () => {
      // arrange
      // act
      await AuthController.rejectDevice(req, res);
      // assert
      expect(sendBadRequest).toHaveBeenCalled();
    });
  });

  describe('refreshTokens', () => {
    test('should sendUnauthorized when invoked', async () => {
      // arrange
      // req.session = {
      //   destroy: jest.fn(),
      // };
      req.cookies = {
        refresh: 'test-refresh-token',
      };
      // act
      await AuthController.refreshTokens(req, res);
      // assert
      expect(sendUnauthorized).toHaveBeenCalled();
    });
  });

  describe('sendOtpToEmail', () => {
    test('should sendOk when invoked', async () => {
      // arrange
      req.body = { email: TEST_EMAIL };
      // act
      await AuthController.sendOtpToEmail(req, res);
      // assert
      expect(sendOK).toHaveBeenCalled();
    });
  });

  describe('sendOtpToPhone', () => {
    test('should sendOk when invoked', async () => {
      // arrange
      req.body = { email: TEST_EMAIL };
      // act
      await AuthController.sendOtpToPhone(req, res);
      // assert
      expect(sendOK).toHaveBeenCalled();
    });
  });

  describe('validateEmail', () => {
    test('should sendOk when invoked', async () => {
      // arrange
      const query = {
        token:
          '413c78fb890955a86d3971828dd05a9b2d844e44d8a30d406f80bf6e79612bb97e8b3b5834c8dbebdf5c4dadc767a579',
      };
      req.query = query;
      // act
      await AuthController.validateEmail(req, res);
      // assert
      expect(sendOK).toHaveBeenCalled();
    });
  });
});
