import {
  Request as IRequest,
  Response as IResponse
} from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { ShortlinkController } from './shortlink.controller';
import {
  sendOK,
  sendBadRequest
} from '@dx/server';

jest.mock('./shortlink.service.ts');
jest.mock('@dx/server', () => ({
  sendOK: jest.fn(),
  sendBadRequest: jest.fn()
}));

describe('ShortlinkController', () => {
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
    expect(ShortlinkController).toBeDefined();
  });

  describe('redirectToTarget', () => {
    test('should send bad request when invoked with a bad id', async () => {
      // arrange
      req.params = {
        id: 'test-id'
      };
      req.session = {
        destroy: jest.fn(),
      };
      // act
      await ShortlinkController.redirectToTarget(req, res);
      // assert
      expect(sendBadRequest).toHaveBeenCalled();
    });
  });
});
