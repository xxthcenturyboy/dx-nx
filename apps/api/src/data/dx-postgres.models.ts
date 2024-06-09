import { UserEmailModel, USER_EMAIL_POSTGRES_DB_NAME } from "@dx/user-email";
import { UserPhoneModel, USER_PHONE_POSTGRES_DB_NAME } from "@dx/user-phone";
import { UserPrivilegeSetModel, USER_PRIVILEGES_POSTGRES_DB_NAME } from "@dx/user-privileges";
import { UserModel, USER_ENTITY_POSTGRES_DB_NAME } from "@dx/user";
import { ModelCtor } from "sequelize-typescript";

export function getPostgresModels(): ModelCtor[] {
  const models: ModelCtor[] = [];

  models.push(UserEmailModel);
  models.push(UserPhoneModel);
  models.push(UserPrivilegeSetModel);
  models.push(UserModel);

  return models;
}

export function logLoadedPostgresModels(): void {
  const models = [
    { tablelName: USER_ENTITY_POSTGRES_DB_NAME },
    { tablelName: USER_EMAIL_POSTGRES_DB_NAME },
    { tablelName: USER_PHONE_POSTGRES_DB_NAME },
    { tablelName: USER_PRIVILEGES_POSTGRES_DB_NAME },
  ];

  console.table(models);
}
