import {
  Sequelize,
  ModelCtor
} from 'sequelize-typescript';
import { PostgresConnectionParamsType } from '../postgres.types';

export class PostgresDbConnection {
  static sequelize: typeof Sequelize.prototype;
  models: ModelCtor[] = [];

  constructor(params: PostgresConnectionParamsType) {
    this.models = params.models;
    PostgresDbConnection.sequelize = new Sequelize({
      validateOnly: true,
      models: params.models
    });
  }

  public static get dbHandle(): typeof Sequelize.prototype | null {
    return PostgresDbConnection.sequelize || null;
  }

  public async initialize() {
    return new Promise<void>(async (resolve) => {
      PostgresDbConnection.sequelize.addModels(this.models);
      await PostgresDbConnection.sequelize.sync();
      resolve();
    });
  }
}
