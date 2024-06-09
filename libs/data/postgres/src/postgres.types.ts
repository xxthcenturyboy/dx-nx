import { ApiLoggingClassType } from "@dx/logger";
import { ModelCtor } from "sequelize-typescript";

export type PostgresUrlObject = {
  params: any;
  protocol?: string;
  user?: string;
  password?: string;
  host?: string;
  hostname?: string;
  port?: number;
  segments?: string[];
};

export type PostgresConnectionParamsType = {
  logger: ApiLoggingClassType;
  models: ModelCtor[],
  postgresUri: string;
};
