import { Redis } from 'ioredis';

import { ApiLoggingClass } from '@dx/logger-api';
import { API_APP_NAME } from '@dx/config-api';
import { RedisService, RedisServiceType } from './redis.service';
import { REDIS_HEALTHZ_DATA, REDIS_HEALTHZ_KEY } from './redis.consts';

jest.mock('@dx/logger');

describe('RedisService', () => {
  let redisService: RedisServiceType;

  beforeAll(() => {
    new ApiLoggingClass({ appName: API_APP_NAME });
    redisService = new RedisService({
      isLocal: false,
      isTest: true,
      redis: {
        port: 6379,
        prefix: 'test:',
        url: 'redis://redis',
      },
    });
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(RedisService).toBeDefined();
  });

  it('should have values when instantiated but prior to initializaiton', () => {
    // arrange
    // act
    // assert
    expect(redisService).toBeDefined();
    expect(RedisService.instance).toBeDefined();
    expect(redisService.logger).toBeDefined();
    expect(redisService.setCacheItem).toBeDefined();
    expect(redisService.setCacheItemWithExpiration).toBeDefined();
    expect(redisService.getCacheItem).toBeDefined();
    expect(redisService.deleteCacheItem).toBeDefined();
    expect(redisService.getKeys).toBeDefined();
  });

  test('should set an item to cache when invoked', async () => {
    // arrange
    // act
    const result = await redisService.setCacheItem(
      REDIS_HEALTHZ_KEY,
      JSON.stringify(REDIS_HEALTHZ_DATA)
    );
    // assert
    expect(result).toBeTruthy();
  });

  test('should set an item with expiration to cache when invoked', async () => {
    // arrange
    // act
    const result = await redisService.setCacheItemWithExpiration(
      REDIS_HEALTHZ_KEY,
      JSON.stringify(REDIS_HEALTHZ_DATA),
      {
        token: 'EXAT',
        time: new Date().getTime() + 20,
      }
    );
    // assert
    expect(result).toBeTruthy();
  });

  test('should get an item from cache when invoked', async () => {
    // arrange
    // act
    const result = await redisService.getCacheItem(REDIS_HEALTHZ_KEY);
    // assert
    expect(result).toBeDefined();
    expect(result).toEqual(REDIS_HEALTHZ_DATA);
  });

  test('should get all keys from cache when invoked', async () => {
    // arrange
    // act
    const result = await redisService.getKeys();
    // assert
    expect(result).toBeDefined();
    expect(result).toEqual([REDIS_HEALTHZ_KEY]);
  });

  test('should delete item from cache when invoked', async () => {
    // arrange
    // act
    const result = await redisService.deleteCacheItem(REDIS_HEALTHZ_KEY);
    const keysAfter = await redisService.getKeys();
    // assert
    expect(result).toBeDefined();
    expect(keysAfter).toEqual([]);
  });
});
