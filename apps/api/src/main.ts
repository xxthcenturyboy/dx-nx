import express from 'express';

import {
  API_APP_NAME,
  getApiConfig
} from '@dx/config-api';
import { ApiLoggingClass } from '@dx/logger-api';
import { DxPostgresDb } from './data/dx-postgres.db';
import { DxRedisCache } from './data/dx-redis.cache';
import { DxSocketClass } from './data/dx-sockets';
import { ApiRoutes } from './routes/api.routes';
import { configureExpress } from './express';

const app = express();

async function run() {
  const logger = new ApiLoggingClass({ appName: API_APP_NAME });

  const postgres = await DxPostgresDb.getPostgresConnection();
  if (!postgres) {
    logger.logInfo('Failed to instantiate the Postgres DB. Exiting');
    return 1;
  }

  const redis = await DxRedisCache.getRedisConnection();
  if (!redis) {
    logger.logInfo('Failed to connect to Redis. Exiting');
    return 1;
  }

  const config = getApiConfig(logger, postgres, redis);

  await configureExpress(app, {
    DEBUG: config.debug,
    SESSION_SECRET: config.sessionSecret,
  });

  const apiRoutes = new ApiRoutes(app);
  apiRoutes.loadRoutes();

  const server = app.listen(config.port, config.host, () => {
    logger.logInfo(
      `
============================================================================
                                ${config.appName}
============================================================================
Environment variables:
  Node Env:   ${config.nodeEnv}
  __dirname:  ${__dirname}
  cwd:        ${process.cwd()}

Settings:
  Host:       ${config.host}
  Port:       ${config.port}
  Debug:      ${config.debug}
    `
    );
    logger.logInfo(`[ ready ] http://${config.host}:${config.port}`);
  });

  const sockets = DxSocketClass.startSockets(server);
  if (sockets) {
    logger.logInfo('Sockets started successfully');
  }
}

run();
