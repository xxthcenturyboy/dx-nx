import { ApiLoggingClass } from '@dx/logger';
import { PostgresDbConnection } from './postgres.db-connection';
import { API_APP_NAME } from '@dx/config';

describe('PostgresDbConnection', () => {
  // arrange
  const logger = new ApiLoggingClass({ appName: API_APP_NAME })
  const postgresUri = 'postgres://pguser:password@postgres:5432/app';
  // act
  const dbConnection = new PostgresDbConnection({
    models: [],
    postgresUri
  });
  const postgres = PostgresDbConnection.dbHandle;
  // assert
  it('should exist when imported', () => {
    expect(PostgresDbConnection).toBeDefined();
  });
  it('should have values when instantiated but prior to initializaiton', () => {
    expect(postgres).toBeDefined();
    expect(postgres.config).toBeDefined();
    expect(dbConnection.initialize).toBeDefined();
    expect(dbConnection.logger).toBeDefined();
    expect(postgres.models).toBeDefined();
    expect(dbConnection.retries).toBeDefined();
    expect(dbConnection.retries).toEqual(5);
    expect(PostgresDbConnection.sequelize).toBeDefined();
  });
});
