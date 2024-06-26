import { Sequelize } from "sequelize-typescript";

import { ApiConfigType } from "./api-config.type";
import { ApiLoggingClassType } from "@dx/logger";
import {
  isDebug,
  getEnvironment
} from "../common/common-config.service";
import {
  LOCAL_ENV_NAME,
  PROD_ENV_NAME
} from '../common/common-config.consts';
import {
  API_APP_NAME,
  APP_PREFIX,
  SENDGRID_API_KEY,
  SENDGRID_URL
} from './api-config.consts';
import {
  REDIS_DELIMITER,
  RedisConfigType,
  RedisServiceType
} from "@dx/redis";

export function getRedisConfig(): RedisConfigType {
  const env = getEnvironment();
  const nodeEnv = env.NODE_ENV || LOCAL_ENV_NAME

  return {
    port: Number(env.REDIS_PORT) || 6379,
    prefix: `${APP_PREFIX}${REDIS_DELIMITER}${nodeEnv}` ,
    url: env.REDIS_URL
  }
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
      jwtSecret: env.JWT_SECRET || ''
    },
    debug: isDebug(),
    host: env.API_HOST || '0.0.0.0',
    isLocal: nodeEnv === LOCAL_ENV_NAME,
    logger: logger,
    nodeEnv: nodeEnv,
    port: Number(env.API_PORT) || 80,
    postgresDbh: postgresDbh,
    redis: redisService,
    sendgrid: {
      apiKey: SENDGRID_API_KEY,
      url: SENDGRID_URL
    },
    sessionSecret: env.SESSION_SECRET || ''
  };
}
