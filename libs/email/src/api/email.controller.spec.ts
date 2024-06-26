import { Request as IRequest, Response as IResponse } from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { EmailController } from './email.controller';
// import { CreateEmailPayloadType } from '../model/email.types';
import {
  sendOK,
  sendBadRequest
} from '@dx/server';

jest.mock('./email.service.ts');
jest.mock('@dx/server', () => ({
  sendOK: jest.fn(),
  sendBadRequest: jest.fn()
}));

describe('EmailController', () => {
  let req: IRequest;
  let res: IResponse;

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
    expect(EmailController).toBeDefined();
  });

  it('should have a validateEmail method when instantiated', () => {
    // arrange
    // act
    // assert
    expect(EmailController.validateEmail).toBeDefined();
  });

  describe('createEmail', () => {
    test('should call sendBadRequest when sent without proper payload', async () => {
      // arrange
      // act
      // assert
      try {
        expect(await EmailController.createEmail(req, res)).toThrow();
      } catch (err) {
        expect(sendBadRequest).toHaveBeenCalled();
      }
    });

    // test('should call sendOK when sent with proper payload', async () => {
    //   // arrange
    //   const payload: CreateEmailPayloadType = {
    //     def: false,
    //     email: 'test@test.com',
    //     label: 'Work',
    //     userId: '2cf4aebd-d30d-4c9e-9047-e52c10fe8d4d'
    //   };
    //   req.body = payload;
    //   // act
    //   await EmailController.createEmail(req, res)
    //   // assert
    //   expect(sendOK).toHaveBeenCalled();
    // });
  });

  describe('updateEmail', () => {
    test('should call sendBadRequest when sent without proper params', async () => {
      // arrange
      // act
      // assert
      try {
        expect(await EmailController.updateEmail(req, res)).toThrow();
      } catch (err) {
        expect(sendBadRequest).toHaveBeenCalled();
      }
    });
  });

  describe('deleteEmail', () => {
    test('should call sendBadRequest when sent without proper query params', async () => {
      // arrange
      // act
      // assert
      try {
        expect(await EmailController.deleteEmail(req, res)).toThrow();
      } catch (err) {
        expect(sendBadRequest).toHaveBeenCalled();
      }
    });
  });

  describe('validateEmail', () => {
    test('should return an error when sent without a token', async () => {
      // arrange
      // act
      // assert
      try {
        expect(await EmailController.validateEmail(req, res)).toThrow();
      } catch (err) {
        expect(sendBadRequest).toHaveBeenCalled();
      }
    });
  });
});
