import {
  Model,
  ModelCtor
} from "sequelize-typescript";

import {
  UserModel,
  UserPrivilegeSetModel
} from "@dx/user";
import { EmailModel } from "@dx/email";
import { PhoneModel } from "@dx/phone";

import { ShortLinkModel } from "@dx/shortlink";
import { logTable } from "@dx/utils";

export function getPostgresModels(): ModelCtor[] {
  const models: ModelCtor[] = [];

  models.push(EmailModel);
  models.push(PhoneModel);
  models.push(ShortLinkModel);
  models.push(UserPrivilegeSetModel);
  models.push(UserModel);

  return models;
}

export function logLoadedPostgresModels(pgModels: { [key: string]: ModelCtor<Model> }): void {
  const MODEL_PROP_NAME = 'Model Name';
  const TABLE_PROP_NAME = 'Table Name';
  const tableNames = Object.keys(pgModels);
  const models = [];
  for (const tableName of tableNames) {
    models.push({
      [MODEL_PROP_NAME]: pgModels[tableName].name,
      [TABLE_PROP_NAME]: pgModels[tableName].tableName
    });
  }

  logTable(models);
}
