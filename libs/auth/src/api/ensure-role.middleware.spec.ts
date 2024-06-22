import {
  Request as IRequest,
  Response as IResponse,
  NextFunction as INextFunction
} from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { next } from 'jest-express/lib/next';

import {
  hasAdminRole,
  hasSuperAdminRole,
  userHasRole
} from './ensure-role.middleware';
import { ApiLoggingClass } from '@dx/logger';
import { HttpResponse } from '@dx/server';
import { USER_ROLE, UserModel } from '@dx/user';

jest.mock('@dx/logger');
jest.mock('@dx/user');

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
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('hasAdminRole', () => {
    it('should exist', () => {
      expect(hasAdminRole).toBeDefined();
    });

    test('should sendUnauthorized when session doesnt have userId', async () => {
      // arrange
      req.session.userId = '';
      // act
      await hasAdminRole(req, res, next);
      // assert
      expect(logErrorSpy).toHaveBeenCalled();
      expect(logWarnSpy).toHaveBeenCalled();
      expect(sendUnauthorizedSpy).toHaveBeenCalled();
      expect(logErrorSpy).toHaveBeenCalledWith('No user ID');
    });

    test('should sendUnauthorized when userId doesnt exist in system', async () => {
      // arrange
      req.session.userId = 'notValidId';
      // act
      await hasAdminRole(req, res, next);
      // assert
      expect(logErrorSpy).toHaveBeenCalled();
      expect(logWarnSpy).toHaveBeenCalled();
      expect(sendUnauthorizedSpy).toHaveBeenCalled();
      expect(logErrorSpy).toHaveBeenCalledWith('no user with this id');
    });

    test('should sendUnauthorized when user doesnt have admin role', async () => {
      // arrange
      req.session.userId = 'user3';
      // act
      await hasAdminRole(req, res, next);
      // assert
      expect(logErrorSpy).toHaveBeenCalled();
      expect(logErrorSpy).toHaveBeenCalledWith('User is not authorized for this activity.');
      expect(logWarnSpy).toHaveBeenCalled();
      expect(sendUnauthorizedSpy).toHaveBeenCalled();
    });

    test('should call next when user does have admin role.', async () => {
      // arrange
      req.session.userId = 'user2';
      // act
      await hasAdminRole(req, res, next);
      // assert
      expect(next).toHaveBeenCalled();
    });
  });

  describe('hasSuperAdminRole', () => {
    it('should exist', () => {
      expect(hasSuperAdminRole).toBeDefined();
    });

    test('should sendUnauthorized when session doesnt have userId', async () => {
      // arrange
      req.session.userId = '';
      // act
      await hasSuperAdminRole(req, res, next);
      // assert
      expect(logErrorSpy).toHaveBeenCalled();
      expect(logWarnSpy).toHaveBeenCalled();
      expect(sendUnauthorizedSpy).toHaveBeenCalled();
      expect(logErrorSpy).toHaveBeenCalledWith('No user ID');
    });

    test('should sendUnauthorized when userId doesnt exist in system', async () => {
      // arrange
      req.session.userId = 'notValidId';
      // act
      await hasSuperAdminRole(req, res, next);
      // assert
      expect(logErrorSpy).toHaveBeenCalled();
      expect(logWarnSpy).toHaveBeenCalled();
      expect(sendUnauthorizedSpy).toHaveBeenCalled();
      expect(logErrorSpy).toHaveBeenCalledWith('no user with this id');
    });

    test('should sendUnauthorized when user doesnt have super admin role', async () => {
      // arrange
      req.session.userId = 'user2';
      // act
      await hasAdminRole(req, res, next);
      // assert
      expect(logErrorSpy).toHaveBeenCalled();
      expect(logErrorSpy).toHaveBeenCalledWith('User is not authorized for this activity.');
      expect(logWarnSpy).toHaveBeenCalled();
      expect(sendUnauthorizedSpy).toHaveBeenCalled();
    });

    test('should call next when user does have super admin role.', async () => {
      // arrange
      req.session.userId = 'user1';
      // act
      await hasAdminRole(req, res, next);
      // assert
      expect(next).toHaveBeenCalled();
    });
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
      expect(logErrorSpy).toHaveBeenCalledWith('no user with this id');
    });

    test('should return false when user does not have role', async () => {
      // arrange
      // act
      const hasRole = await userHasRole('user3', USER_ROLE.ADMIN);
      // assert
      expect(hasRole).toBeFalsy();
    });

    test('should return true when user has role', async () => {
      // arrange
      // act
      const hasRole = await userHasRole('user1', USER_ROLE.ADMIN);
      // assert
      expect(hasRole).toBeTruthy();
    });
  });
});
