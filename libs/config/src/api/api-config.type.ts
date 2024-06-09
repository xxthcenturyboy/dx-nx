import { Sequelize } from 'sequelize-typescript';
import { ApiLoggingClassType } from "@dx/logger";
import { RedisServiceType } from '@dx/redis';

export type ApiConfigType = {
  appName: string;
  debug: boolean;
  host: string;
  isLocal: boolean;
  logger: ApiLoggingClassType;
  nodeEnv: string;
  port: number;
  postgresDbh: typeof Sequelize.prototype;
  redis: RedisServiceType;
};
