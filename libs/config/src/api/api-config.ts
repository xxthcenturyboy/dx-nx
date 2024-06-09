import { Sequelize } from "sequelize-typescript";

import { ApiConfigType } from "./api-config.type";
import { ApiLoggingClassType } from "@dx/logger";
import {
  isDebug,
  getEnvironment
} from "../common/common-config.service";
import { LOCAL_ENV_NAME } from '../common/common-config.consts';
import {
  API_APP_NAME,
  APP_PREFIX,
} from './api-config.consts';
import { REDIS_DELIMITER } from "@dx/redis";

export function getApiConfig(
  logger: ApiLoggingClassType,
  postgresDbh: typeof Sequelize.prototype
): ApiConfigType {
  const env = getEnvironment();

  const nodeEnv = env.NODE_ENV || LOCAL_ENV_NAME;

  return {
    appName: API_APP_NAME,
    debug: isDebug(),
    host: env.API_HOST || '0.0.0.0',
    isLocal: nodeEnv === LOCAL_ENV_NAME,
    logger: logger,
    nodeEnv: nodeEnv,
    port: Number(env.API_PORT) || 80,
    postgresDbh: postgresDbh,
    redis: {
      port: Number(env.REDIS_PORT) || 6379,
      prefix: `${APP_PREFIX}${REDIS_DELIMITER}${nodeEnv}` ,
      url: env.REDIS_URL
    }
  };
}
