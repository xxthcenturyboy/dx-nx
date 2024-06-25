import {
  Request as IRequest,
  Response as IResponse
} from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { ShortlinkController } from './shortlink.controller';

jest.mock('./shortlink.service.ts');

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

  it('should have a getData method when instantiated', () => {
    // arrange
    // act
    // assert
    expect(ShortlinkController.getData).toBeDefined();
  });

  describe('getData', () => {
    it('should return a message when invoked', () => {
      // arrange
      // act
      ShortlinkController.getData(req, res);
      // assert
      expect(res.send).toHaveBeenCalled();
    });
  });
});
