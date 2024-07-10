import { API_APP_NAME } from '@dx/config-api';
import { ApiLoggingClass } from './api-logging.class';

describe('ApiLoggingClass', () => {
  // arrange
  const logger = new ApiLoggingClass({ appName: API_APP_NAME });
  // act
  // assert
  it('should exist when imported', () => {
    expect(ApiLoggingClass).toBeDefined();
  });
  it('should have methods when instantiated', () => {
    expect(logger).toBeDefined();
    expect(logger.logDebug).toBeDefined();
    expect(logger.logError).toBeDefined();
    expect(logger.logInfo).toBeDefined();
    expect(logger.logWarn).toBeDefined();
    expect(logger.logger).toBeDefined();
  });
});
