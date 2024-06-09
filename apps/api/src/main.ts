import express from 'express';

import {
  API_APP_NAME,
  getApiConfig,
  POSTGRES_URI
} from '@dx/config';
import { ApiLoggingClass } from '@dx/logger';
import { getPostgresModels } from './data/postgres.models';
import { PostgresDbConnection } from '@dx/postgres';
import { RoutesV1 } from './routes/v1.routes';

const app = express();

async function run() {
  const logger = new ApiLoggingClass({ appName: API_APP_NAME });
  let postgres: typeof PostgresDbConnection.prototype;

  try {
    postgres = new PostgresDbConnection({
      logger,
      models: getPostgresModels(),
      postgresUri: POSTGRES_URI
    });
    await postgres.initialize();
  } catch (err) {
    logger.logError((err as Error).message, err);
    throw err;
  }

  const config = getApiConfig(logger, postgres.dbHandle);

  const v1Routes = new RoutesV1(app);
  v1Routes.loadRoutes();

  app.listen(config.port, config.host, () => {
    logger.logInfo(
      `
      ============================================================================
      ${config.appName}
      ============================================================================
      Environment variables:
      Node Env:  ${config.nodeEnv}
      __dirname: ${__dirname}
      cwd:       ${process.cwd()}
      Settings:
      Port: ${config.port}
      Debug:     ${config.debug}
    `
    );
    logger.logInfo(`[ ready ] http://${config.host}:${config.port}`);
  });
}

run();
