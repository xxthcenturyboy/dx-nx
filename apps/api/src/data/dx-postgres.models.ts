import { ModelCtor } from "sequelize-typescript";

import {
  UserModel, USER_ENTITY_POSTGRES_DB_NAME,
  UserEmailModel, USER_EMAIL_POSTGRES_DB_NAME,
  UserPhoneModel, USER_PHONE_POSTGRES_DB_NAME,
  UserPrivilegeSetModel, USER_PRIVILEGES_POSTGRES_DB_NAME
} from "@dx/user";

export function getPostgresModels(): ModelCtor[] {
  const models: ModelCtor[] = [];

  models.push(UserEmailModel);
  models.push(UserPhoneModel);
  models.push(UserPrivilegeSetModel);
  models.push(UserModel);

  return models;
}

export function logLoadedPostgresModels(): void {
  const TABLE_PROP_NAME = 'Table Name';
  const models = [
    { [TABLE_PROP_NAME]: USER_ENTITY_POSTGRES_DB_NAME },
    { [TABLE_PROP_NAME]: USER_EMAIL_POSTGRES_DB_NAME },
    { [TABLE_PROP_NAME]: USER_PHONE_POSTGRES_DB_NAME },
    { [TABLE_PROP_NAME]: USER_PRIVILEGES_POSTGRES_DB_NAME },
  ];

  console.table(models);
}
