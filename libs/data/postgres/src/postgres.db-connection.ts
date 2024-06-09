import { ModelCtor, Sequelize } from 'sequelize-typescript';
import { ApiLoggingClassType } from '@dx/logger';

import {
  PostgresConnectionParamsType,
  PostgresUrlObject
} from './postgres.types';
import { parsePostgresConnectionUrl } from './parse-postgres-connection-url';

export class PostgresDbConnection {
  config: PostgresUrlObject;
  logger: ApiLoggingClassType;
  retries = 5;
  models: ModelCtor[] = [];
  sequelize: typeof Sequelize.prototype;

  constructor(params: PostgresConnectionParamsType) {
    this.logger = params.logger;
    this.config = parsePostgresConnectionUrl(params.postgresUri);
    if (!this.config) {
      this.logger.logError('Postgres URL could not be parsed successfully.', this.config);
    }
    this.models = params.models;

    this.sequelize = new Sequelize({
      database: this.config.segments && this.config.segments[0],
      dialect: 'postgres',
      username: this.config.user,
      password: this.config.password,
      host: this.config.hostname,
      port: this.config.port,
      // storage: ':memory:',
      dialectOptions: {
        ssl: false,
      },
      define: {
        underscored: true,
      },
      logging: () => { }
    });
  }

  get dbHandle(): Sequelize | null {
    return this.sequelize || null;
  }

  async initialize(): Promise<void> {
    if (!this.sequelize) {
      throw new Error('Sequelize failed to instantiate');
    }

    if (
      (
        !Array.isArray(this.models)
        || this.models.length === 0
      )
    ) {
      throw new Error('No models!');
    }

    await this.sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
    await this.sequelize.query('CREATE EXTENSION IF NOT EXISTS "fuzzystrmatch";');
    await this.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    this.sequelize.addModels(this.models);

    while (this.retries) {
      try {
        this.logger.logInfo('Establishing Postgres Connection.', { yourMom: 'blows hard', yourDad: 'eats poo' });
        await this.sequelize.authenticate();
        this.logger.logInfo('Successfully Connected to Postgres');
        this.logger.logInfo('Loading Sequelize models.');
        await this.sequelize.sync();
        this.logger.logInfo('successfully loaded Sequelize Models.');
        break;
      } catch (err) {
        this.logger.logError((err as Error).message, err);
        this.retries -= 1;
        if (!this.retries) {
          throw new Error('Could not establish a connection to Postgres.');
        }
        this.logger.logInfo(`${this.retries} Postgres DB connection retries left.`);
        await new Promise(res => setTimeout(res, 5000));
      }
    }
  }
}
