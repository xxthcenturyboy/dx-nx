import {
  getPostgresModels,
  logLoadedPostgresModels
} from './dx-postgres.models';
import { POSTGRES_URI } from '@dx/config';
import { ApiLoggingClassType } from '@dx/logger';
import { PostgresDbConnection } from '@dx/postgres';

export class DxPostgresDb {
  public static async getPostgresConnection(
    logger: ApiLoggingClassType
  ): Promise<PostgresDbConnection | null> {
    try {
      const postgres = new PostgresDbConnection({
        logger,
        models: getPostgresModels(),
        postgresUri: POSTGRES_URI
      });

      await postgres.initialize();

      logger.logInfo(
        `
Postgres:
  DB Name:   ${postgres.dbHandle.getDatabaseName()}
  version:   ${await postgres.dbHandle.databaseVersion()}
      `
      );

      logLoadedPostgresModels();

      return postgres;
    } catch (err) {
      logger.logError((err as Error).message, err);
      return null
    }
  }
}
