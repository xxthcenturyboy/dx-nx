import {
  Model,
  ModelCtor
} from 'sequelize-typescript';

import { UserModel } from '@dx/user-api';
import { UserPrivilegeSetModel } from '@dx/user-privilege-api';
import { DeviceModel } from '@dx/devices-api';
import { EmailModel } from '@dx/email-api';
import { PhoneModel } from '@dx/phone-api';
import { MediaModel } from '@dx/media-api';
import { NotificationModel } from '@dx/notifications-api';
import { ShortLinkModel } from '@dx/shortlink-api';
import { logTable } from '@dx/logger-api';

export function getPostgresModels(): ModelCtor[] {
  const models: ModelCtor[] = [];

  models.push(DeviceModel);
  models.push(EmailModel);
  models.push(PhoneModel);
  models.push(MediaModel);
  models.push(NotificationModel);
  models.push(ShortLinkModel);
  models.push(UserPrivilegeSetModel);
  models.push(UserModel);

  return models;
}

export function logLoadedPostgresModels(pgModels: {
  [key: string]: ModelCtor<Model>;
}): void {
  const MODEL_PROP_NAME = 'Model Name';
  const TABLE_PROP_NAME = 'Table Name';
  const tableNames = Object.keys(pgModels);
  const models = [];
  for (const tableName of tableNames) {
    models.push({
      [MODEL_PROP_NAME]: pgModels[tableName].name,
      [TABLE_PROP_NAME]: pgModels[tableName].tableName,
    });
  }

  logTable(models);
}
