import {
  Sequelize
} from 'sequelize-typescript';
import { PostgresConnectionParamsType } from '../postgres.types';

export class PostgresDbConnection {
  static sequelize: typeof Sequelize.prototype;

  constructor(params: PostgresConnectionParamsType) {
  }

  public static get dbHandle(): typeof Sequelize.prototype | null {
    return PostgresDbConnection.sequelize || null;
  }

  public async initialize() {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }
}
