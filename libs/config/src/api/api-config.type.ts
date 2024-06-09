import { Sequelize } from 'sequelize-typescript';
import { ApiLoggingClassType } from "@dx/logger";

export type ApiRedisConfigType = {
  port: number;
  prefix: string;
  url: string;
};

export type ApiConfigType = {
  appName: string;
  debug: boolean;
  host: string;
  isLocal: boolean;
  logger: ApiLoggingClassType;
  nodeEnv: string;
  port: number;
  postgresDbh: typeof Sequelize.prototype;
  redis: ApiRedisConfigType;
};
