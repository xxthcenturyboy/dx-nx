import { Request as IRequest, Response as IResponse } from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { sendOK, sendBadRequest } from '@dx/utils-api-http-response';
import { DevicesController } from './devices.controller';

jest.mock('./devices.service.ts');
jest.mock('@dx/utils-api-http-response', () => ({
  sendOK: jest.fn(),
  sendBadRequest: jest.fn(),
}));

describe('DevicesController', () => {
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
    expect(DevicesController).toBeDefined();
  });

  describe('disconnectDevice', () => {
    it('should exist', () => {
      // arrange
      // act
      // assert
      expect(DevicesController.disconnectDevice).toBeDefined();
    });
    test('should sendBadRequest when invoked', async () => {
      // arrange
      // act
      await DevicesController.disconnectDevice(req, res);
      // assert
      expect(sendOK).toHaveBeenCalled();
    });
  });

  describe('updateFcmToken', () => {
    it('should exist', () => {
      // arrange
      // act
      // assert
      expect(DevicesController.updateFcmToken).toBeDefined();
    });
    test('should sendBadRequest when invoked', async () => {
      // arrange
      // act
      await DevicesController.updateFcmToken(req, res);
      // assert
      expect(sendOK).toHaveBeenCalled();
    });
  });

  describe('updatePublicKey', () => {
    it('should exist', () => {
      // arrange
      // act
      // assert
      expect(DevicesController.updatePublicKey).toBeDefined();
    });
    test('should sendBadRequest when invoked', async () => {
      // arrange
      // act
      await DevicesController.updatePublicKey(req, res);
      // assert
      expect(sendOK).toHaveBeenCalled();
    });
  });
});
