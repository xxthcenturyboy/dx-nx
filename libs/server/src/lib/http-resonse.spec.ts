import {
  Request as IRequest,
  Response as IResponse
} from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { next } from 'jest-express/lib/next';
import { StatusCodes } from 'http-status-codes';

import { ApiLoggingClass } from '@dx/logger';
import { HttpResponse } from './http-response';

jest.mock('@dx/auth');
jest.mock('@dx/logger');

describe('HttpResponse', () => {
  let req: IRequest;
  let res: IResponse;

  const logErrorSpy = jest.spyOn(ApiLoggingClass.prototype, 'logError');
  const logWarnSpy = jest.spyOn(ApiLoggingClass.prototype, 'logWarn');
  // @ts-expect-error - spying on private method
  const send400Spy = jest.spyOn(HttpResponse.prototype, 'send400');
  // @ts-expect-error - spying on private method
  const destroySessionSpy = jest.spyOn(HttpResponse.prototype, 'destroySession');

  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
  });

  beforeEach(() => {
    req = new Request() as unknown as IRequest;
    res = new Response() as unknown as IResponse;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(HttpResponse).toBeDefined();
  });

  it('should have a logger after instantiation', () => {
    // arrange
    const res = new HttpResponse();
    // act
    // assert
    expect(res.logger).toBeDefined();
  });

  it('should send a success response with data when sendOk is invoked', () => {
    // arrange
    const http = new HttpResponse();
    const data = { test: 'data' };
    // act
    http.sendOK(req, res, data);
    // assert
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.send).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledWith(data);
    expect(res.end).toHaveBeenCalled();
  });

  it('should send a file response with data when sendFile is invoked', () => {
    // arrange
    const http = new HttpResponse();
    const filePath = '/download';
    const fileName = 'test.png';
    // act
    http.sendFile(req, res, filePath, fileName);
    // assert
    expect(res.download).toHaveBeenCalled();
  });

  it('should send a method not allowed response with data when endpointNotFound is invoked', () => {
    // arrange
    const http = new HttpResponse();
    // act
    http.endpointNotFound(req, res, next);
    // assert
    expect(logErrorSpy).toHaveBeenCalled();
    expect(send400Spy).toHaveBeenCalled();
  });

  it('should send a 400 response with data when sendBadRequest is invoked', () => {
    // arrange
    const http = new HttpResponse();
    // act
    http.sendBadRequest(req, res, 'bad request');
    // assert
    expect(send400Spy).toHaveBeenCalled();
  });

  it('should send a 400 response with data when sendUnauthorized is invoked', () => {
    // arrange
    const http = new HttpResponse();
    // act
    http.sendUnauthorized(req, res, 'not authorized');
    // assert
    expect(logWarnSpy).toHaveBeenCalled();
    expect(destroySessionSpy).toHaveBeenCalled();
    expect(send400Spy).toHaveBeenCalled();
  });

  it('should send a 400 response with data when sendForbidden is invoked', () => {
    // arrange
    const http = new HttpResponse();
    // act
    http.sendForbidden(req, res, 'not authorized');
    // assert
    expect(logWarnSpy).toHaveBeenCalled();
    expect(destroySessionSpy).toHaveBeenCalled();
    expect(send400Spy).toHaveBeenCalled();
  });

  it('should send a 400 response with data when sendNotFound is invoked', () => {
    // arrange
    const http = new HttpResponse();
    // act
    http.sendNotFound(req, res, 'not found');
    // assert
    expect(logWarnSpy).toHaveBeenCalled();
    expect(send400Spy).toHaveBeenCalled();
  });

  it('should send a 400 response with data when sendMethodNotAllowed is invoked', () => {
    // arrange
    const http = new HttpResponse();
    // act
    http.sendMethodNotAllowed(req, res, 'not allowed');
    // assert
    expect(logWarnSpy).toHaveBeenCalled();
    expect(send400Spy).toHaveBeenCalled();
  });
});
