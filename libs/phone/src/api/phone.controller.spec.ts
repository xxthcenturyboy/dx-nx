import {
  Request as IRequest,
  Response as IResponse
} from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { PhoneController } from './phone.controller';
import {
  sendOK,
  sendBadRequest
} from '@dx/server';

jest.mock('./phone.service.ts');
jest.mock('@dx/server', () => ({
  sendOK: jest.fn(),
  sendBadRequest: jest.fn()
}));

describe('PhoneController', () => {
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
    expect(PhoneController).toBeDefined();
  });

  describe('createPhone', () => {
    test('should call sendBadRequest when sent without proper payload', async () => {
      // arrange
      // act
      // assert
      try {
        expect(await PhoneController.createPhone(req, res)).toThrow();
      } catch (err) {
        expect(sendBadRequest).toHaveBeenCalled();
      }
    });
  });

  describe('updatePhone', () => {
    test('should call sendBadRequest when sent without proper params', async () => {
      // arrange
      // act
      // assert
      try {
        expect(await PhoneController.updatePhone(req, res)).toThrow();
      } catch (err) {
        expect(sendBadRequest).toHaveBeenCalled();
      }
    });
  });

  describe('deletePhone', () => {
    test('should call sendBadRequest when sent without proper query params', async () => {
      // arrange
      // act
      // assert
      try {
        expect(await PhoneController.deletePhone(req, res)).toThrow();
      } catch (err) {
        expect(sendBadRequest).toHaveBeenCalled();
      }
    });
  });
});
