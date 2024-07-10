import { ApiLoggingClass } from '@dx/logger-api';
import { API_APP_NAME } from '@dx/config-api';
import { RedisService } from './redis.service';
import { RedisHealthzService, RedisHealthzServiceType } from './redis.healthz';
import { REDIS_HEALTHZ_DATA, REDIS_HEALTHZ_KEY } from './redis.consts';

jest.mock('@dx/logger');

describe('RedisHealthzService', () => {
  let redisHealthz: RedisHealthzServiceType;
  const logInfoSpy = jest.spyOn(ApiLoggingClass.prototype, 'logInfo');
  // @ts-expect-error - private method
  const testConnectionSpy = jest.spyOn(
    RedisHealthzService.prototype,
    'testConnection'
  );
  const testReadAndWriteSpy = jest.spyOn(
    RedisHealthzService.prototype,
    'testReadAndWrite'
  );

  beforeAll(() => {
    new ApiLoggingClass({ appName: API_APP_NAME });
    new RedisService({
      isLocal: false,
      isTest: true,
      redis: {
        port: 6379,
        prefix: 'test',
        url: 'redis://redis',
      },
    });
    redisHealthz = new RedisHealthzService();
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(RedisHealthzService).toBeDefined();
  });

  it('should have values when instantiated but prior to initializaiton', () => {
    // arrange
    // act
    // assert
    expect(redisHealthz).toBeDefined();
    expect(redisHealthz.healthCheck).toBeDefined();
    expect(redisHealthz.logger).toBeDefined();
    expect(redisHealthz.redis).toBeDefined();
    expect(redisHealthz.testData).toBeDefined();
    expect(redisHealthz.testData).toEqual(REDIS_HEALTHZ_DATA);
    expect(redisHealthz.testKey).toBeDefined();
    expect(redisHealthz.testKey).toEqual(REDIS_HEALTHZ_KEY);
    expect(redisHealthz.testReadAndWrite).toBeDefined();
  });

  test('should perform a health check when invoked', async () => {
    // arrange
    // act
    await redisHealthz.healthCheck();
    // assert
    expect(testConnectionSpy).toHaveBeenCalledTimes(1);
    expect(testReadAndWriteSpy).toHaveBeenCalledTimes(1);
    expect(logInfoSpy).toHaveBeenCalledTimes(8);
  });
});
