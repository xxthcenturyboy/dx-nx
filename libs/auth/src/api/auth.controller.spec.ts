import {
  Request as IRequest,
  Response as IResponse
} from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { AuthController } from './auth.controller';
import {
  GetByTokenQueryType,
  SignupPayloadType,
  UserLookupQueryType
} from '../model/auth.types';
import { USER_LOOKUPS } from '../model/auth.consts';
import {
  sendOK,
  sendBadRequest
} from '@dx/server';

jest.mock('./auth.service.ts');
jest.mock('./token.service.ts');
jest.mock('@dx/server', () => ({
  sendOK: jest.fn(),
  sendBadRequest: jest.fn()
}));

describe('AuthController', () => {
  let req: IRequest;
  let res: IResponse;

  beforeEach(() => {
    req = new Request() as unknown as IRequest;
    res = new Response() as unknown as IResponse;
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
      expect(sendOK).toHaveBeenCalled();
    });
  });
});
