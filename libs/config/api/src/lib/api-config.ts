import { Sequelize } from 'sequelize-typescript';

import { ApiLoggingClassType } from '@dx/logger-api';
import {
  APP_PREFIX,
  LOCAL_ENV_NAME
} from '@dx/config-shared';
import {
  isDebug,
  isLocal,
  getEnvironment
} from './api-config.service';
import {
  API_APP_NAME,
  SENDGRID_API_KEY,
  SENDGRID_URL,
} from './api-config.consts';
import { RedisConfigType, RedisServiceType } from '@dx/data-access-redis';
import { ApiConfigType } from './api-config.type';

export function getRedisConfig(): RedisConfigType {
  const env = getEnvironment();
  const nodeEnv = env.NODE_ENV || LOCAL_ENV_NAME;

  return {
    port: Number(env.REDIS_PORT) || 6379,
    prefix: `${APP_PREFIX}`,
    url: env.REDIS_URL,
  };
}

export function getApiConfig(
  logger: ApiLoggingClassType,
  postgresDbh: typeof Sequelize.prototype,
  redisService: RedisServiceType
): ApiConfigType {
  const env = getEnvironment();

  const nodeEnv = env.NODE_ENV || LOCAL_ENV_NAME;

  return {
    appName: API_APP_NAME,
    auth: {
      jwtSecret: env.JWT_SECRET || '',
    },
    debug: isDebug(),
    host: isLocal() ? '0.0.0.0' : env.API_URL,
    isLocal: nodeEnv === LOCAL_ENV_NAME,
    logger: logger,
    nodeEnv: nodeEnv,
    port: Number(env.API_PORT),
    postgresDbh: postgresDbh,
    redis: redisService,
    sendgrid: {
      apiKey: SENDGRID_API_KEY,
      url: SENDGRID_URL,
    },
    sessionSecret: env.SESSION_SECRET || '',
    webUrl: `${env.WEB_APP_URL}:${env.WEB_APP_PORT}`
  };
}
