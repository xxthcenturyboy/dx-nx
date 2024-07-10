import { Model, ModelCtor, Sequelize } from 'sequelize-typescript';

import { POSTGRES_URI } from '@dx/config-api';
import { ApiLoggingClass } from '@dx/logger-api';
import { PostgresDbConnection } from '@dx/data-access-postgres';
import {
  getPostgresModels,
  logLoadedPostgresModels,
} from './dx-postgres.models';

export class DxPostgresDb {
  public static async getPostgresConnection(): Promise<
    typeof Sequelize.prototype | null
  > {
    const logger = ApiLoggingClass.instance;
    try {
      const postgres = new PostgresDbConnection({
        models: getPostgresModels(),
        postgresUri: POSTGRES_URI,
      });

      await postgres.initialize();

      logLoadedPostgresModels(
        PostgresDbConnection.dbHandle.models as {
          [key: string]: ModelCtor<Model>;
        }
      );

      logger.logInfo('Successfully Connected to Postgres');
      return PostgresDbConnection.dbHandle;
    } catch (err) {
      logger.logError((err as Error).message, err);
      return null;
    }
  }
}
