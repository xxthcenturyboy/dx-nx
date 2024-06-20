import { Sequelize } from 'sequelize-typescript';

import { ApiLoggingClassType } from "@dx/logger";
import { RedisServiceType } from '@dx/redis';

export type AuthConfigType = {
  jwtSecret: string;
}

export type ApiConfigType = {
  appName: string;
  auth: AuthConfigType;
  debug: boolean;
  host: string;
  isLocal: boolean;
  logger: ApiLoggingClassType;
  nodeEnv: string;
  port: number;
  postgresDbh: typeof Sequelize.prototype;
  redis: RedisServiceType;
  sessionSecret: string;
};
