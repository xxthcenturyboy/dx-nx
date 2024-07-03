import { Request as IRequest, Response as IResponse } from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { DevicesController } from './devices.controller';

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

  it('should have a getData method when instantiated', () => {
    // arrange
    // act
    // assert
    expect(DevicesController.getData).toBeDefined();
  });

  describe('getData', () => {
    it('should return a message when invoked', () => {
      // arrange
      // act
      DevicesController.getData(req, res);
      // assert
      expect(res.send).toHaveBeenCalled();
    });
  });
});
