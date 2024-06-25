import { Request as IRequest, Response as IResponse } from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { PhoneController } from './phone.controller';

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

  it('should have a getData method when instantiated', () => {
    // arrange
    // act
    // assert
    expect(PhoneController.getData).toBeDefined();
  });

  describe('getData', () => {
    it('should return a message when invoked', () => {
      // arrange
      // act
      PhoneController.getData(req, res);
      // assert
      expect(res.send).toHaveBeenCalled();
    });
  });
});
