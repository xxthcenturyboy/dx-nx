import {
  Request as IRequest,
  Response as IResponse,
  NextFunction as INextFunction,
} from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { next } from 'jest-express/lib/next';

import {
  hasAdminRole,
  hasSuperAdminRole,
  userHasRole,
} from './ensure-role.middleware';
import { ApiLoggingClass } from '@dx/logger-api';
import { sendUnauthorized } from '@dx/utils-api-http-response';
import { USER_ROLE } from '@dx/user-privilege-shared';
import { TokenService } from './token.service';
import { CookeiService } from '@dx/utils-api-cookies';
import { TEST_EXISTING_USER_ID, TEST_UUID } from '@dx/config-shared';

jest.mock('@dx/logger-api');
jest.mock('@dx/utils-api-cookies', () => ({
  CookeiService: {
    clearCookie: jest.fn(),
    clearCookies: jest.fn(),
    getCookie: jest.fn(),
    setCookie: jest.fn(),
    setCookies: jest.fn(),
  },
}));
jest.mock('@dx/utils-api-headers', () => ({
  sendUnauthorized: jest.fn(),
}));
jest.mock('@dx/utils-api-http-response', () => ({
  sendUnauthorized: jest.fn(),
}));
jest.mock('@dx/user-api');

describe('ensureLoggedIn', () => {
  let req: IRequest;
  let res: IResponse;

  const logErrorSpy = jest.spyOn(ApiLoggingClass.prototype, 'logError');

  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
  });

  beforeEach(async () => {
    req = new Request() as unknown as IRequest;
    res = new Response() as unknown as IResponse;
    req.url = 'http://test-url.com';
    const tokens = TokenService.generateTokens(TEST_EXISTING_USER_ID);
    CookeiService.setCookies(
      res,
      true,
      tokens.refreshToken,
      tokens.refreshTokenExp
    );
    req.cookies = {
      refresh: tokens.refreshToken,
      token: tokens.accessToken,
    };
    req.headers = {
      authorization: `Bearer ${tokens.accessToken}`,
    };
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('hasAdminRole', () => {
    it('should exist', () => {
      expect(hasAdminRole).toBeDefined();
    });

    test('should sendUnauthorized when no authorizaiton header', async () => {
      // arrange
      req.headers = {};
      // act
      await hasAdminRole(req, res, next);
      // assert
      expect(logErrorSpy).toHaveBeenCalled();
      expect(sendUnauthorized).toHaveBeenCalled();
      // expect(logErrorSpy).toHaveBeenCalledWith('No Auth Headers Sent.');
    });

    test('should sendUnauthorized when token is invalid', async () => {
      // arrange
      req.headers = {
        authorization: `Bearer ${TEST_UUID}`,
      };
      // act
      await hasAdminRole(req, res, next);
      // assert
      expect(logErrorSpy).toHaveBeenCalled();
      expect(sendUnauthorized).toHaveBeenCalled();
      // expect(logErrorSpy).toHaveBeenCalledWith('Token invalid or expired.');
    });

    // test('should call next when user does have admin role.', async () => {
    //   // arrange
    //   // act
    //   await hasAdminRole(req, res, next);
    //   // assert
    //   expect(next).toHaveBeenCalled();
    // });
  });

  describe('hasSuperAdminRole', () => {
    it('should exist', () => {
      expect(hasSuperAdminRole).toBeDefined();
    });

    test('should sendUnauthorized when no authorizaiton header', async () => {
      // arrange
      req.headers = {};
      // act
      await hasSuperAdminRole(req, res, next);
      // assert
      expect(logErrorSpy).toHaveBeenCalled();
      expect(sendUnauthorized).toHaveBeenCalled();
      // expect(logErrorSpy).toHaveBeenCalledWith('No Auth Headers Sent.');
    });

    test('should sendUnauthorized when token is invalid', async () => {
      // arrange
      req.headers = {
        authorization: `Bearer ${TEST_UUID}`,
      };
      // act
      await hasSuperAdminRole(req, res, next);
      // assert
      expect(logErrorSpy).toHaveBeenCalled();
      expect(sendUnauthorized).toHaveBeenCalled();
      // expect(logErrorSpy).toHaveBeenCalledWith('Token invalid or expired.');
    });

    // test('should call next when user does have super admin role.', async () => {
    //   // arrange
    //   // act
    //   await hasSuperAdminRole(req, res, next);
    //   // assert
    //   expect(next).toHaveBeenCalled();
    // });
  });

  describe('userHasRole', () => {
    it('should exist', () => {
      expect(userHasRole).toBeDefined();
    });

    test('should return false when userId does not exist', async () => {
      // arrange
      // act
      const hasRole = await userHasRole('notValidId', USER_ROLE.ADMIN);
      // assert
      expect(hasRole).toBeFalsy();
      expect(logErrorSpy).toHaveBeenCalled();
      // expect(logErrorSpy).toHaveBeenCalledWith('no user with this id');
    });
  });
});
