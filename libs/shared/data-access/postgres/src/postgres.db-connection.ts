import { ModelCtor, Sequelize } from 'sequelize-typescript';

import { ApiLoggingClass, ApiLoggingClassType } from '@dx/logger';
import {
  PostgresConnectionParamsType,
  PostgresUrlObject,
} from './postgres.types';
import { parsePostgresConnectionUrl } from './parse-postgres-connection-url';

export class PostgresDbConnection {
  config: PostgresUrlObject;
  logger: ApiLoggingClassType;
  retries = 5;
  models: ModelCtor[] = [];
  static sequelize: typeof Sequelize.prototype;

  constructor(params: PostgresConnectionParamsType) {
    this.logger = ApiLoggingClass.instance;
    this.config = parsePostgresConnectionUrl(params.postgresUri);
    if (!this.config) {
      this.logger.logError(
        'Postgres URL could not be parsed successfully.',
        this.config
      );
    }
    this.models = params.models;

    PostgresDbConnection.sequelize = new Sequelize({
      database: this.config.segments && this.config.segments[0],
      dialect: 'postgres',
      username: this.config.user,
      password: this.config.password,
      host: this.config.hostname,
      port: this.config.port,
      dialectOptions: {
        ssl: false,
      },
      define: {
        underscored: true,
      },
      logging: () => {},
    });
  }

  public static get dbHandle(): typeof Sequelize.prototype | null {
    return PostgresDbConnection.sequelize || null;
  }

  async initialize(): Promise<void> {
    if (!PostgresDbConnection.sequelize) {
      throw new Error('Sequelize failed to instantiate');
    }

    if (!Array.isArray(this.models) || this.models.length === 0) {
      const errorMessage = 'No Models for Postgres DB!';
      this.logger.logError(errorMessage);
      throw new Error(errorMessage);
    }

    await PostgresDbConnection.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "pgcrypto";'
    );
    await PostgresDbConnection.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "fuzzystrmatch";'
    );
    await PostgresDbConnection.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'
    );

    PostgresDbConnection.sequelize.addModels(this.models);

    while (this.retries) {
      try {
        this.logger.logInfo('Establishing Postgres Connection.');
        await PostgresDbConnection.sequelize.authenticate();
        this.logger.logInfo(
          `
  Postgres:
    DB Name:   ${PostgresDbConnection.dbHandle.getDatabaseName()}
    version:   ${await PostgresDbConnection.dbHandle.databaseVersion()}
        `
        );
        this.logger.logInfo('Loading Sequelize models.');
        await PostgresDbConnection.sequelize.sync();
        break;
      } catch (err) {
        this.logger.logError((err as Error).message, err);
        this.retries -= 1;
        if (!this.retries) {
          throw new Error('Could not establish a connection to Postgres.');
        }
        this.logger.logInfo(
          `${this.retries} Postgres DB connection retries left.`
        );
        await new Promise((res) => setTimeout(res, 5000));
      }
    }
  }
}
