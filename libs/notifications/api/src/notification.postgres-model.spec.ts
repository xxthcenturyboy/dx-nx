import { Sequelize } from 'sequelize-typescript';

import { PostgresDbConnection } from '@dx/data-access-postgres';
import { ApiLoggingClass } from '@dx/logger-api';
import { EmailModel } from '@dx/email-api';
import { PhoneModel } from '@dx/phone-api';
import { UserModel } from '@dx/user-api';
import { UserPrivilegeSetModel } from '@dx/user-privilege-api';
import {
  isLocal,
  POSTGRES_URI
} from '@dx/config-api';
import { NotificationModel } from './notification.postgres-model';
import { NOTIFICATION_POSTGRES_DB_NAME } from './notification.consts';

jest.mock('@dx/logger-api');

describe('Notifications Model', () => {
  if (isLocal()) {
    let db: Sequelize;

    beforeAll(async () => {
      new ApiLoggingClass({ appName: 'Unit-Test' });
      const connection = new PostgresDbConnection({
        postgresUri: POSTGRES_URI,
        models: [
          NotificationModel,
          EmailModel,
          PhoneModel,
          UserPrivilegeSetModel,
          UserModel,
        ],
      });
      await connection.initialize();
      db = PostgresDbConnection.dbHandle;
    });

    afterAll(async () => {
      await db.close();
    });

    describe('NotificationModel', () => {
      it('should exist when initialized', () => {
        // arrange
        // act
        // assert
        expect(NotificationModel).toBeDefined();
        expect(NotificationModel.isInitialized).toBeTruthy();
        expect(NotificationModel.name).toEqual(NOTIFICATION_POSTGRES_DB_NAME);
        expect(NotificationModel.primaryKeyAttribute).toEqual('id');
      });

      it('should have required attributes', () => {
        // arrange
        const attributes = NotificationModel.getAttributes();
        // act
        // assert
        expect(attributes.createdAt).toBeDefined();
        expect(attributes.deletedAt).toBeDefined();
        expect(attributes.dismissedAt).toBeDefined();
        expect(attributes.id).toBeDefined();
        expect(attributes.lastReadDate).toBeDefined();
        expect(attributes.level).toBeDefined();
        expect(attributes.message).toBeDefined();
        expect(attributes.read).toBeDefined();
        expect(attributes.route).toBeDefined();
        expect(attributes.title).toBeDefined();
        expect(attributes.userId).toBeDefined();
        expect(attributes.viewed).toBeDefined();
        expect(attributes.viewedDate).toBeDefined();
      });

      it('should have associations', () => {
        // arrange
        // act
        // assert
        expect(NotificationModel.associations).toHaveProperty('user');
        // @ts-expect-error - prototype exists
        expect(NotificationModel.prototype?.getUser).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(NotificationModel.prototype?.setUser).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(NotificationModel.prototype?.createUser).toBeDefined();
      });

      it('should have static methods', () => {
        // arrange
        // act
        // assert
        expect(NotificationModel.createNew).toBeDefined();
        expect(NotificationModel.getAttributes).toBeDefined();
        expect(NotificationModel.getByUserId).toBeDefined();
        expect(NotificationModel.getTableName).toBeDefined();
        expect(NotificationModel.markAllAsRead).toBeDefined();
        expect(NotificationModel.markAsDismissed).toBeDefined();
        expect(NotificationModel.markAsRead).toBeDefined();
        expect(NotificationModel.markAsViewed).toBeDefined();
      });
    });
  } else {
    describe('NotificationModel', () => {
      it('should exist when imported', () => {
        // arange
        // act
        // assert
        expect(NotificationModel).toBeDefined();
      });
    });
  }
});
