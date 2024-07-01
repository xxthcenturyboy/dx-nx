import {
  Request as IRequest,
  Response as IResponse
} from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { AuthController } from './auth.controller';
import {
  LoginPaylodType
} from '../model/auth.types';
import {
  sendOK,
  sendBadRequest
} from '@dx/server';
import { ApiLoggingClass } from '@dx/logger';
import {
  TEST_EMAIL,
  TEST_PASSWORD,
  TEST_PHONE,
  TEST_PHONE_VALID
} from '@dx/config';

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

  it('should have authLookup method when instantiated', () => {
    // arrange
    // act
    // assert
    expect(AuthController.authLookup).toBeDefined();
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
        value: TEST_EMAIL,
        password: TEST_PASSWORD
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

  describe('sendOtpToEmail', () => {
    test('should sendOk when invoked', async () => {
      // arrange
      req.body = { email: TEST_EMAIL };
      // act
      await AuthController.sendOtpToEmail(req, res);
      // assert
      expect(sendBadRequest).toHaveBeenCalled();
    });
  });

  describe('sendOtpToPhone', () => {
    test('should sendOk when invoked', async () => {
      // arrange
      req.body = { email: TEST_EMAIL };
      // act
      await AuthController.sendOtpToPhone(req, res);
      // assert
      expect(sendBadRequest).toHaveBeenCalled();
    });
  });

  describe('validateEmail', () => {
    test('should sendOk when invoked', async () => {
      // arrange
      const query = {
        token: '413c78fb890955a86d3971828dd05a9b2d844e44d8a30d406f80bf6e79612bb97e8b3b5834c8dbebdf5c4dadc767a579'
      };
      req.query = query;
      // act
      await AuthController.validateEmail(req, res);
      // assert
      expect(sendOK).toHaveBeenCalled();
    });
  });
});
