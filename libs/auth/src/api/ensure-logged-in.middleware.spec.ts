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
import { HttpResponse } from '@dx/server';
import { TokenService } from './token.service';

jest.mock('@dx/logger');

describe('ensureLoggedIn', () => {
  let req: IRequest;
  let res: IResponse;

  const logErrorSpy = jest.spyOn(ApiLoggingClass.prototype, 'logError');
  const logWarnSpy = jest.spyOn(ApiLoggingClass.prototype, 'logWarn');
  const sendUnauthorizedSpy = jest.spyOn(HttpResponse.prototype, 'sendUnauthorized');

  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
  });

  beforeEach(async () => {
    req = new Request() as unknown as IRequest;
    res = new Response() as unknown as IResponse;
    req.session = {
      userId: 'test-user-id',
      refreshToken: 'test-refresh-token',
      destroy: () => null
    };
    req.sessionId = 'test-session-id';
    req.url = 'http://test-url.com';
    const tokenService = new TokenService(req, res);
    await tokenService.issueAll();
    req.cookies = {
      refresh: 'test-refresh-token',
      token: tokenService.token
    };
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should exist', () => {
    expect(ensureLoggedIn).toBeDefined();
  });

  test('should sendUnauthorized when not logged in', async () => {
    // arrange
    req.cookies = {};
    // act
    await ensureLoggedIn(req, res, next);
    // assert
    expect(logErrorSpy).toHaveBeenCalled();
    expect(logWarnSpy).toHaveBeenCalled();
    expect(sendUnauthorizedSpy).toHaveBeenCalled();
  });

  test('should sendUnauthorized when no token is present on the request', async () => {
    // arrange
    req.cookies = {
      refresh: 'test-refresh-token'
    };
    // act
    await ensureLoggedIn(req, res, next);
    // assert
    expect(logErrorSpy).toHaveBeenCalled();
    expect(logWarnSpy).toHaveBeenCalled();
    expect(sendUnauthorizedSpy).toHaveBeenCalled();
    expect(logErrorSpy).toHaveBeenCalledWith('Failed to authenticate tokens: No token MOFO');
  });

  test('should sendUnauthorized when refreshToken is invalid', async () => {
    // arrange
    // act
    await ensureLoggedIn(req, res, next);
    // assert
    expect(logErrorSpy).toHaveBeenCalled();
    expect(logWarnSpy).toHaveBeenCalled();
    expect(sendUnauthorizedSpy).toHaveBeenCalled();
    expect(logErrorSpy).toHaveBeenCalledWith('Failed to authenticate tokens: Refresh token is invalid');
  });

  test('should sendUnauthorized when Auth token is invalid', async () => {
    // arrange
    req.cookies = {
      token: 'invalid-token',
      refresh: 'invalid-token'
    };
    new TokenService(req, res);

    // act
    await ensureLoggedIn(req, res, next);
    // assert
    expect(logErrorSpy).toHaveBeenCalled();
    expect(logWarnSpy).toHaveBeenCalled();
    expect(sendUnauthorizedSpy).toHaveBeenCalled();
    expect(logErrorSpy).toHaveBeenCalledWith('Failed to authenticate tokens: Auth Token Invalid');
  });
});
