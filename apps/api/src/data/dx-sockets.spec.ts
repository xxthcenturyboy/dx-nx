import { DxSocketClass } from './dx-sockets';
import { ApiLoggingClass } from '@dx/logger-api';

jest.mock('@dx/data-access-socket-io-api');
jest.mock('@dx/logger-api');

describe('dx-sockets', () => {
  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
  });

  it('should exist', () => {
    // arrange
    // act
    // assert
    expect(DxSocketClass).toBeDefined();
  });

  it('should have a public static method of startSockets', () => {
    // arrange
    // act
    // assert
    expect(DxSocketClass.startSockets).toBeDefined();
  });
});
