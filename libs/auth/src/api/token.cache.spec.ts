import { RedisService } from "@dx/redis";

import { ApiLoggingClass } from '@dx/logger';
import { TokenCache } from './token.cache';

jest.mock('@dx/logger');
jest.mock('@dx/redis');

describe('handleError', () => {
  // const logErrorSpy = jest.spyOn(ApiLoggingClass.prototype, 'logError');
  // @ts-expect-error - spying on private method
  const formattedKeyNameSpy = jest.spyOn(TokenCache.prototype, 'getFormattedKeyName');
  let tokenCache: typeof TokenCache.prototype;

  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
    new RedisService({
      isLocal: true,
      redis: {
        port: 6379,
        prefix: 'dx',
        url: 'redis://redis'
      }
    });
    tokenCache = new TokenCache();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should exist', () => {
    expect(TokenCache).toBeDefined();
  });

  test('should set an item to cache when invoked', async () => {
    // arrange
    const userId = 'test-user-id';
    const item = { ['refresh-token-id']: true };
    // act
    const result = await tokenCache.setCache(userId, item);
    // assert
    expect(formattedKeyNameSpy).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });

  test('should get an item from cache when invoked', async () => {
    // arrange
    const userId = 'test-user-id';
    // act
    const result = await tokenCache.getCache(userId);
    // assert
    expect(formattedKeyNameSpy).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  test('should remove an item to cache when invoked', async () => {
    // arrange
    const userId = 'test-user-id';
    // act
    const result = await tokenCache.deleteCache(userId);
    // assert
    expect(formattedKeyNameSpy).toHaveBeenCalled();
    expect(result).toBeTruthy();
  });
});
