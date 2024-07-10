import { Request as IRequest, Response as IResponse } from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { WellKnownController } from './well-known.controller';

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
    expect(WellKnownController).toBeDefined();
  });

  it('should have a getAndroidData method when instantiated', () => {
    // arrange
    // act
    // assert
    expect(WellKnownController.getAndroidData).toBeDefined();
  });

  it('should have a getAppleData method when instantiated', () => {
    // arrange
    // act
    // assert
    expect(WellKnownController.getAppleData).toBeDefined();
  });

  describe('getAndroidData', () => {
    it('should return data when called', () => {
      // arrange
      // act
      WellKnownController.getAndroidData(req, res);
      // assert
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('getAppleData', () => {
    it('should return data when called', () => {
      // arrange
      // act
      WellKnownController.getAppleData(req, res);
      // assert
      expect(res.send).toHaveBeenCalled();
    });
  });
});
