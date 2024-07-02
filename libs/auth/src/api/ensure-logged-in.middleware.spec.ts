import {
  Request as IRequest,
  Response as IResponse,
  NextFunction as INextFunction
} from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { next } from 'jest-express/lib/next';

import { ensureLoggedIn } from './ensure-logged-in.middleware';
import { ApiLoggingClass } from '@dx/logger';
import { sendUnauthorized } from '@dx/server';
import { TokenService } from './token.service';
import { CookeiService } from '@dx/server';
import { TEST_EXISTING_USER_ID, TEST_UUID } from '@dx/config';
import { UserModel } from '@dx/user';

jest.mock('@dx/logger');
jest.mock('@dx/server', () => ({
  CookeiService: {
    clearCookie: jest.fn(),
    clearCookies: jest.fn(),
    getCookie: jest.fn(),
    setCookie: jest.fn(),
    setCookies: jest.fn()
  },
  sendUnauthorized: jest.fn()
}));

describe('ensureLoggedIn', () => {
  let req: IRequest;
  let res: IResponse;
  let tokens = {
    accessToken: '',
    refreshToken: ''
  };

  const logErrorSpy = jest.spyOn(ApiLoggingClass.prototype, 'logError');
  const getUserSessionSpy = jest.spyOn(UserModel, 'getUserSessionData');

  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
  });

  beforeEach(async () => {
    req = new Request() as unknown as IRequest;
    res = new Response() as unknown as IResponse;
    req.url = 'http://test-url.com';
    const tokens = TokenService.generateTokens(TEST_EXISTING_USER_ID);
    CookeiService.setCookies(res, true, tokens.refreshToken, tokens.refreshTokenExp);
    req.cookies = {
      refresh: tokens.refreshToken,
      token: tokens.accessToken
    };
    req.headers = {
      authorization: `Bearer ${tokens.accessToken}`
    }
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should exist', () => {
    expect(ensureLoggedIn).toBeDefined();
  });

  test('should sendUnauthorized when no authorizaiton header', async () => {
    // arrange
    req.headers = {};
    // act
    await ensureLoggedIn(req, res, next);
    // assert
    expect(logErrorSpy).toHaveBeenCalled();
    expect(sendUnauthorized).toHaveBeenCalled();
    expect(logErrorSpy).toHaveBeenCalledWith('Failed to authenticate tokens: No Auth Headers Sent.');
  });

  test('should sendUnauthorized when token is invalid', async () => {
    // arrange
    req.headers = {
      authorization: `Bearer ${TEST_UUID}`
    };
    // act
    await ensureLoggedIn(req, res, next);
    // assert
    expect(logErrorSpy).toHaveBeenCalled();
    expect(sendUnauthorized).toHaveBeenCalled();
    expect(logErrorSpy).toHaveBeenCalledWith('Failed to authenticate tokens: Token invalid or expired.');
  });

  test('should sendUnauthorized when Auth token is invalid', async () => {
    // arrange
    // act
    await ensureLoggedIn(req, res, next);
    // assert
    expect(getUserSessionSpy).toHaveBeenCalled();
    expect(getUserSessionSpy).toHaveBeenCalledWith(TEST_EXISTING_USER_ID);
  });
});
