import { UserEmailModel } from "@dx/user-email";
import { UserPhoneModel } from "@dx/user-phone";
import { UserPrivilegeSetModel } from "@dx/user-privileges";
import { UserModel } from "@dx/user";
import { ModelCtor } from "sequelize-typescript";

export function getPostgresModels(): ModelCtor[] {
  const models: ModelCtor[] = [];

  models.push(UserEmailModel);
  models.push(UserPhoneModel);
  models.push(UserPrivilegeSetModel);
  models.push(UserModel);

  return models;
}
