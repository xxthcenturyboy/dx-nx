import { DxPostgresDb } from './dx-postgres.db';
import { ApiLoggingClass } from '@dx/logger';

jest.mock('@dx/postgres');
jest.mock('@dx/logger');
jest.mock('./dx-postgres.models.ts');

describe('dx-postgres.db', () => {
  const logInfoSpy = jest.spyOn(ApiLoggingClass.prototype, 'logInfo');

  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
  });

  it('should exist', () => {
    // arrange
    // act
    // assert
    expect(DxPostgresDb).toBeDefined();
  });

  it('should have a public static method of getPostgresConnection', () => {
    // arrange
    // act
    // assert
    expect(DxPostgresDb.getPostgresConnection).toBeDefined();
  });

  test('should instantiate a db connection when invoked', async () => {
    // arrange
    // act
    const dbHandle = await DxPostgresDb.getPostgresConnection();
    // assert
    expect(dbHandle).toBeDefined();
    expect(logInfoSpy).toHaveBeenCalledWith('Successfully Connected to Postgres');
  });
});
