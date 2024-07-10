import { Sequelize } from 'sequelize-typescript';

import { ApiLoggingClass } from '@dx/logger-api';
import { API_APP_NAME } from '@dx/config-api';
import { UserModel } from '@dx/user-api';
import { PostgresDbConnection } from './postgres.db-connection';

jest.mock('@dx/logger-api');
jest.mock('@dx/user-api');

describe('PostgresDbConnection', () => {
  let dbConnection: typeof PostgresDbConnection.prototype;
  let postgres: typeof Sequelize.prototype;
  const postgresUri = 'postgres://pguser:password@postgres:5432/app';

  // const logInfoSpy = jest.spyOn(ApiLoggingClass.prototype, 'logInfo');

  beforeAll(() => {
    new ApiLoggingClass({ appName: API_APP_NAME });
    try {
      dbConnection = new PostgresDbConnection({
        models: [UserModel],
        postgresUri,
      });
      postgres = PostgresDbConnection.dbHandle;
    } catch (err) {
      console.log(err);
    }
  });

  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(PostgresDbConnection).toBeDefined();
  });

  it('should have values when instantiated but prior to initializaiton', () => {
    // arrange
    // act
    // assert
    expect(postgres).toBeDefined();
    expect(dbConnection.config).toBeDefined();
    expect(dbConnection.initialize).toBeDefined();
    expect(dbConnection.logger).toBeDefined();
    expect(dbConnection.models).toBeDefined();
    expect(dbConnection.retries).toBeDefined();
    expect(dbConnection.retries).toEqual(5);
    expect(PostgresDbConnection.sequelize).toBeDefined();
  });
});
