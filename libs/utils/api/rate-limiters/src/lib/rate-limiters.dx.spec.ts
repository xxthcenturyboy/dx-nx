import { Request as IRequest, Response as IResponse } from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { RedisService } from '@dx/data-access-redis';
import { DxRateLimiters } from './rate-limiters.dx';

jest.mock('@dx/api-http-response', () => ({
  sendOK: jest.fn(),
  sendBadRequest: jest.fn(),
  sendTooManyRequests: jest.fn(),
}));

describe('DxRateLimiters', () => {
  let req: IRequest;
  let res: IResponse;

  beforeAll(async () => {
    new RedisService({
      isLocal: true,
      isTest: true,
      redis: {
        port: 6379,
        prefix: 'dx',
        url: 'redis://redis',
      },
    });
  });

  beforeEach(() => {
    // console.log(RedisService.instance.cacheHandle);
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
    expect(DxRateLimiters).toBeDefined();
  });

  describe('authLookup', () => {
    test('should exist on the class', async () => {
      // arrange
      // act
      // assert
      expect(DxRateLimiters.authLookup).toBeDefined();
    });
  });

  describe('login', () => {
    test('should exist on the class', async () => {
      // arrange
      // act
      // assert
      expect(DxRateLimiters.standard).toBeDefined();
    });
  });

  describe('login', () => {
    test('should exist on the class', async () => {
      // arrange
      // act
      // assert
      expect(DxRateLimiters.strict).toBeDefined();
    });
  });

  describe('veryStrict', () => {
    test('should exist on the class', async () => {
      // arrange
      // act
      // assert
      expect(DxRateLimiters.veryStrict).toBeDefined();
    });
  });
});
