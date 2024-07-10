import { ApiLoggingClass } from '@dx/logger-api';
import { RedisService } from '@dx/data-access-redis';
import { TEST_COUNTRY_CODE, TEST_EMAIL, TEST_PHONE } from '@dx/config-shared';
import { getRedisConfig } from '@dx/config-api';
import { OtpCodeCache, OtpCodeCacheType } from './otp-code.redis-cache';

jest.mock('@dx/logger-api');

describe('OtpCodeCache', () => {
  let cache: OtpCodeCacheType;
  let otpEmail: string;
  let otpPhone: string;

  beforeAll(async () => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
    const redisConfig = getRedisConfig();
    new RedisService({
      isLocal: true,
      isTest: true,
      redis: redisConfig,
    });
  });

  beforeEach(() => {
    cache = new OtpCodeCache();
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(OtpCodeCache).toBeDefined();
  });

  it('should exist when instantiated', () => {
    // arrange
    // act
    // assert
    expect(cache).toBeDefined();
  });

  describe('setEmailOtp', () => {
    test('should return false no data is passed', async () => {
      // arrange
      // act
      const result = await cache.setEmailOtp('');
      // assert
      expect(result).toBeFalsy();
    });
    test('should set to Cache and get OTP code when invoked', async () => {
      // arrange
      // act
      otpEmail = await cache.setEmailOtp(TEST_EMAIL);
      // assert
      expect(otpEmail).toBeTruthy();
    });
  });

  describe('setPhoneOtp', () => {
    test('should return false no data is passed', async () => {
      // arrange
      // act
      const result = await cache.setPhoneOtp('', '');
      // assert
      expect(result).toBeFalsy();
    });
    test('should set to Cache and get OTP code when invoked', async () => {
      // arrange
      // act
      otpPhone = await cache.setPhoneOtp(TEST_COUNTRY_CODE, TEST_PHONE);
      // assert
      expect(otpPhone).toBeTruthy();
    });
  });

  describe('validateEmailOtp', () => {
    test('return false when code not passed', async () => {
      // arrange
      // act
      const result = await cache.validateEmailOtp('', TEST_EMAIL);
      // assert
      expect(result).toBe(false);
    });
    test('should return false when code is incorrect', async () => {
      // arrange
      // act
      const result = await cache.validateEmailOtp('OU812', TEST_EMAIL);
      // assert
      expect(result).toBe(false);
    });

    test('should return true when code is correct', async () => {
      // arrange
      let otpCache = new OtpCodeCache();
      // act
      const result = await otpCache.validateEmailOtp(otpEmail, TEST_EMAIL);
      // assert
      expect(result).toBe(true);
    });
  });

  describe('validatePhoneOtp', () => {
    test('return false when code not passed', async () => {
      // arrange
      // act
      const result = await cache.validatePhoneOtp(
        '',
        TEST_COUNTRY_CODE,
        TEST_PHONE
      );
      // assert
      expect(result).toBe(false);
    });
    test('should return false when code is incorrect', async () => {
      // arrange
      // act
      const result = await cache.validatePhoneOtp(
        'OU812',
        TEST_COUNTRY_CODE,
        TEST_PHONE
      );
      // assert
      expect(result).toBe(false);
    });

    test('should return true when code is correct', async () => {
      // arrange
      let otpCache = new OtpCodeCache();
      // act
      const result = await otpCache.validatePhoneOtp(
        otpPhone,
        TEST_COUNTRY_CODE,
        TEST_PHONE
      );
      // assert
      expect(result).toBe(true);
    });
  });
});
