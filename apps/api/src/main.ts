import express from 'express';

import {
  API_APP_NAME,
  getApiConfig
} from '@dx/config';
import { ApiLoggingClass } from '@dx/logger';
import { DxPostgresDb } from './data/dx-postgres.db';
import { DxRedisCache } from './data/dx-redis.cache';
import { RoutesV1 } from './routes/v1.routes';

const app = express();

async function run() {
  const logger = new ApiLoggingClass({ appName: API_APP_NAME });

  const postgres = await DxPostgresDb.getPostgresConnection(logger);
  if (!postgres) {
    logger.logInfo('Failed to instantiate the Postgres DB. Exiting');
    return;
  }

  const redis = await DxRedisCache.getRedisConnection(logger);
  if (!redis) {
    logger.logInfo('Failed to connect to Redis. Exiting');
    return;
  }


  const config = getApiConfig(logger, postgres.dbHandle, redis);

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
