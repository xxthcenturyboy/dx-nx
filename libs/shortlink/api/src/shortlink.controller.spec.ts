import { Request as IRequest, Response as IResponse } from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { sendOK, sendBadRequest } from '@dx/utils-api-http-response';
import { ShortlinkController } from './shortlink.controller';

jest.mock('./shortlink.service.ts');
jest.mock('@dx/utils-api-http-response', () => ({
  sendOK: jest.fn(),
  sendBadRequest: jest.fn(),
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

  describe('getTarget', () => {
    test('should send bad request when invoked with a bad id', async () => {
      // arrange
      req.params = {
        id: 'test-id',
      };
      // act
      await ShortlinkController.getTarget(req, res);
      // assert
      expect(sendBadRequest).toHaveBeenCalled();
    });
  });
});
