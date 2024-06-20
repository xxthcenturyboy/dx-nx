import { DxRedisCache } from './dx-redis.cache';
import { ApiLoggingClass } from '@dx/logger';

jest.mock('@dx/redis');
jest.mock('@dx/logger');

describe('dx-redis.cache', () => {
  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
  });

  it('should exist', () => {
    // arrange
    // act
    // assert
    expect(DxRedisCache).toBeDefined();
  });

  it('should have a public static method of getRedisConnection', () => {
    // arrange
    // act
    // assert
    expect(DxRedisCache.getRedisConnection).toBeDefined();
  });

  test('should instantiate a redis connection when invoked', async () => {
    // arrange
    // act
    const cacheHandle = await DxRedisCache.getRedisConnection();
    // assert
    expect(cacheHandle).toBeDefined();
  });
});
