import { Sequelize } from 'sequelize-typescript';
import { ApiLoggingClassType } from "@dx/logger";

export type ApiConfigType = {
  appName: string;
  debug: boolean;
  host: string;
  logger: ApiLoggingClassType;
  nodeEnv: string;
  port: number;
  postgresDbh: typeof Sequelize.prototype;
};
