import { Sequelize } from 'sequelize-typescript';

import { ApiLoggingClassType } from '@dx/logger-api';
import { RedisServiceType } from '@dx/data-access-redis';

export type AuthConfigType = {
  jwtSecret: string;
};

export type SendgridConfigType = {
  apiKey: string;
  url: string;
};

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
  sendgrid: SendgridConfigType;
  sessionSecret: string;
  webUrl: string;
};
