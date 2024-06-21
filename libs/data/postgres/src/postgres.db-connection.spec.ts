import { ApiLoggingClass } from '@dx/logger';
import { Sequelize } from 'sequelize-typescript';

import { PostgresDbConnection } from './postgres.db-connection';
import { API_APP_NAME } from '@dx/config';
import { UserModel } from '@dx/user';

jest.mock('sequelize-typescript');
jest.mock('@dx/logger');
jest.mock('@dx/user');

describe('PostgresDbConnection', () => {
  let dbConnection: typeof PostgresDbConnection.prototype;
  let postgres: typeof Sequelize.prototype;
  const postgresUri = 'postgres://pguser:password@postgres:5432/app';

  const logInfoSpy = jest.spyOn(ApiLoggingClass.prototype, 'logInfo');

  beforeAll(() => {
    new ApiLoggingClass({ appName: API_APP_NAME });
    dbConnection = new PostgresDbConnection({
      models: [UserModel],
      postgresUri
    });
    postgres = PostgresDbConnection.dbHandle;
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

  test('should call seqeulize methods when instantiated', async () => {
    // arrange
    // act
    await dbConnection.initialize();
    // assert
    expect(PostgresDbConnection.sequelize.addModels).toHaveBeenCalledTimes(1);
    expect(PostgresDbConnection.sequelize.authenticate).toHaveBeenCalledTimes(1);
    expect(PostgresDbConnection.sequelize.query).toHaveBeenCalledTimes(3);
    expect(PostgresDbConnection.sequelize.sync).toHaveBeenCalledTimes(1);
    expect(logInfoSpy).toHaveBeenCalledTimes(3);
  });
});
