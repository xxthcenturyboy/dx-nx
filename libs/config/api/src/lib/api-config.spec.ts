import { Sequelize } from 'sequelize-typescript';

import { ApiLoggingClass } from '@dx/logger-api';
import { API_APP_NAME, POSTGRES_URI } from '@dx/config-api';
import { RedisService } from '@dx/data-access-redis';
import { PostgresDbConnection } from '@dx/data-access-postgres';
import { ShortLinkModel } from '@dx/shortlink-api';
import {
  getApiConfig,
  getRedisConfig
} from './api-config';

jest.mock('@dx/logger-api');

describe('getApiConfig', () => {
  let db: Sequelize;
  let redis: RedisService;

  beforeAll(async () => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
    const connection = new PostgresDbConnection({
      postgresUri: POSTGRES_URI,
      models: [
        ShortLinkModel
      ],
    });
    await connection.initialize();
    db = PostgresDbConnection.dbHandle;
    redis = new RedisService({
      isLocal: true,
      redis: {
        port: 6379,
        prefix: 'dx',
        url: 'redis://redis',
      },
    });
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await db.close();
  });

  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(getApiConfig).toBeDefined();
  });
  it('should have correct values', () => {
    // arrange
    // act
    const config = getApiConfig(
      ApiLoggingClass.instance,
      db,
      redis
    );
    // console.log(config);
    // assert
    expect(config.appName).toEqual(API_APP_NAME);
    expect(config.auth).toEqual({ jwtSecret: 'some-string' });
    expect(config.debug).toEqual(false);
    expect(config.host).toEqual('http://localhost');
    expect(config.isLocal).toEqual(false);
    expect(config.logger).toBeDefined();
    expect(config.nodeEnv).toEqual('test');
    expect(config.port).toEqual(4000);
    expect(config.postgresDbh).toBeDefined();
    expect(config.redis).toBeDefined();
    expect(config.sendgrid).toEqual({ apiKey: 'SG.secret', url: 'http://sendgrid:3000' });
    expect(config.sessionSecret).toEqual('0123456789');
    expect(config.webUrl).toEqual('http://localhost:4200');
  });
});

describe('getRedisConfig', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(getRedisConfig).toBeDefined();
  });
  it('should have the correct values', () => {
    // arrange
    // act
    const settings = getRedisConfig();
    // assert
    expect(settings.port).toEqual(6379);
    expect(settings.prefix).toEqual('dx');
    expect(settings.url).toEqual('redis://redis');
  });
});
