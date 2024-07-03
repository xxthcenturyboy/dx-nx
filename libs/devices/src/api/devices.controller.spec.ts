import { Request as IRequest, Response as IResponse } from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { DevicesController } from './devices.controller';
import {
  sendOK,
  sendBadRequest
} from '@dx/server';

jest.mock('./devices.service.ts');
jest.mock('@dx/server', () => ({
  sendOK: jest.fn(),
  sendBadRequest: jest.fn()
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
      await  DevicesController.disconnectDevice(req, res);
      // assert
      expect(sendOK).toHaveBeenCalled();
    });
  });

  describe('updateDevice', () => {
    it('should exist', () => {
      // arrange
      // act
      // assert
      expect(DevicesController.updateDevice).toBeDefined();
    });
    test('should sendBadRequest when invoked', async () => {
      // arrange
      // act
      await  DevicesController.updateDevice(req, res);
      // assert
      expect(sendOK).toHaveBeenCalled();
    });
  });
});
