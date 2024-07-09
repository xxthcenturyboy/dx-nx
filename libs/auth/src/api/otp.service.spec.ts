import { ApiLoggingClass } from '@dx/logger';
import { RedisService } from '@dx/data-access-api-redis';
import { OtpService } from './otp.service';

/**
 * The functionality of this service is fully tested in the auth.service.spec
 * This is just to ensure that the methods exist
 */
describe('OtpService', () => {
  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
    new RedisService({
      isLocal: true,
      redis: {
        port: 6379,
        prefix: 'dx',
        url: 'redis://redis',
      },
    });
  });

  it('should exist', () => {
    expect(OtpService).toBeDefined();
  });

  describe('generateOptCode', () => {
    test('should exist', async () => {
      // arrange
      // act
      // assert
      expect(OtpService.generateOptCode).toBeDefined();
    });
  });

  describe('validateOptCode', () => {
    test('should exist', async () => {
      // arrange
      // act
      // assert
      expect(OtpService.validateOptCode).toBeDefined();
    });
  });
});
