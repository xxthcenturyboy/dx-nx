import { Sequelize } from 'sequelize-typescript';
import { DxPostgresDb } from './dx-postgres.db';
import { ApiLoggingClass } from '@dx/logger';
import { isLocal } from '@dx/config';

// jest.mock('@dx/postgres');
jest.mock('@dx/logger');
// jest.mock('./dx-postgres.models.ts');

describe('dx-postgres.db', () => {
  let dbHandle: Sequelize;
  const logInfoSpy = jest.spyOn(ApiLoggingClass.prototype, 'logInfo');

  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
  });

  afterAll(() => {
    isLocal() && dbHandle.close();
  })

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

  if (isLocal()) {
    test('should instantiate a db connection when invoked', async () => {
      // arrange
      // act
      dbHandle = await DxPostgresDb.getPostgresConnection();
      // assert
      expect(dbHandle).toBeDefined();
      expect(logInfoSpy).toHaveBeenCalledWith('Successfully Connected to Postgres');
    });
  }
});
