import { DxS3Class } from './dx-s3';
import { ApiLoggingClass } from '@dx/logger-api';

jest.mock('@dx/data-access-socket-io-api');
jest.mock('@dx/logger-api');

describe('dx-s3', () => {
  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
  });

  it('should exist', () => {
    // arrange
    // act
    // assert
    expect(DxS3Class).toBeDefined();
  });

  it('should have a public static method of initializeS3', () => {
    // arrange
    // act
    // assert
    expect(DxS3Class.initializeS3).toBeDefined();
  });
});
