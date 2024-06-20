import {
  Request as IRequest,
  Response as IResponse
} from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { StatusCodes } from 'http-status-codes';

import { ApiLoggingClass } from '@dx/logger';
import { HttpResponse } from './http-response';
import { handleError } from './error-handler';

// jest.mock('@dx/auth');
jest.mock('@dx/logger');

describe('handleError', () => {
  let req: IRequest;
  let res: IResponse;

  const logErrorSpy = jest.spyOn(ApiLoggingClass.prototype, 'logError');
  const sendBadRequestSpy = jest.spyOn(HttpResponse.prototype, 'sendBadRequest');
  const sendForbiddenSpy = jest.spyOn(HttpResponse.prototype, 'sendForbidden');

  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
  });

  beforeEach(() => {
    req = new Request() as unknown as IRequest;
    res = new Response() as unknown as IResponse;
  });

  afterAll(() => {
    jest.clearAllMocks();
  })

  it('should exist', () => {
    expect(handleError).toBeDefined();
  });

  it('should log error and send bad request when message sent', () => {
    // arrange
    const message = 'test message';
    // act
    handleError(req, res, { message }, message);
    // assert
    expect(logErrorSpy).toHaveBeenCalled();
    expect(sendBadRequestSpy).toHaveBeenCalled();
  });

  it('should log error and send forbidden when error code is FORBIDDEN', () => {
    // arrange
    const message = 'test message';
    const error = {
      code: StatusCodes.FORBIDDEN,
      message
    }
    // act
    handleError(req, res, error);
    // assert
    expect(logErrorSpy).toHaveBeenCalled();
    expect(sendForbiddenSpy).toHaveBeenCalled();
  });

  it('should log error and send bad request when no message is present', () => {
    // arrange
    const message = 'test message';
    const error = {
      code: StatusCodes.BAD_REQUEST,
      message
    }
    // act
    handleError(req, res, error);
    // assert
    expect(logErrorSpy).toHaveBeenCalled();
    expect(sendBadRequestSpy).toHaveBeenCalled();
  });
});
