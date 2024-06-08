import { Sequelize } from "sequelize-typescript";

import { ApiConfigType } from "./api-config.type";
import { ApiLoggingClassType } from "@dx/logger";
import {
  isDebug,
  getEnvironment
} from "../common/common-config.service";
import { LOCAL_ENV_NAME } from '../common/common-config.consts';
import { API_APP_NAME } from './api-config.consts'

export function getApiConfig(
  logger: ApiLoggingClassType,
  postgresDbh: typeof Sequelize.prototype
): ApiConfigType {
  const env = getEnvironment();

  return {
    appName: API_APP_NAME,
    debug: isDebug(),
    host: env.API_HOST || '0.0.0.0',
    logger: logger,
    nodeEnv: env.NODE_ENV || LOCAL_ENV_NAME,
    port: Number(env.API_PORT) || 80,
    postgresDbh: postgresDbh
  };
}
