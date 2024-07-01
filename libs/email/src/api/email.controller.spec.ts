import { Request as IRequest, Response as IResponse } from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { EmailController } from './email.controller';
// import { CreateEmailPayloadType } from '../model/email.types';
// import { TEST_EMAIL, TEST_EXISTING_USER_ID } from '@dx/config';
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
    //     email: TEST_EMAIL,
    //     label: 'Work',
    //     userId: TEST_EXISTING_USER_ID
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

});
