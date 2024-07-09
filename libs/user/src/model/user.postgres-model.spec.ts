import { Sequelize } from 'sequelize-typescript';

import { PostgresDbConnection } from '@dx/data-access-postgres';
import { ApiLoggingClass } from '@dx/logger';
import { DeviceModel } from '@dx/devices';
import { EmailModel } from '@dx/email';
import { PhoneModel } from '@dx/phone';
import { UserModel } from './user.postgres-model';
import { UserPrivilegeSetModel } from './user-privilege.postgres-model';
import {
  USER_ENTITY_POSTGRES_DB_NAME,
  USER_PRIVILEGES_POSTGRES_DB_NAME,
} from './user.consts';
import { isLocal } from '@dx/config-shared';
import { POSTGRES_URI } from '@dx/config-api';

jest.mock('@dx/logger');

describe('User Models', () => {
  if (isLocal()) {
    let db: Sequelize;

    beforeAll(async () => {
      new ApiLoggingClass({ appName: 'Unit-Test' });
      const connection = new PostgresDbConnection({
        postgresUri: POSTGRES_URI,
        models: [
          DeviceModel,
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

    describe('UserModel', () => {
      it('should exist when initialized', () => {
        // arrange
        // act
        // assert
        expect(UserModel).toBeDefined();
        expect(UserModel.isInitialized).toBeTruthy();
        expect(UserModel.name).toEqual(USER_ENTITY_POSTGRES_DB_NAME);
        expect(UserModel.primaryKeyAttribute).toEqual('id');
      });

      it('should have required attributes', () => {
        // arrange
        const attributes = UserModel.getAttributes();
        // act
        // assert
        expect(attributes.accountLocked).toBeDefined();
        expect(attributes.createdAt).toBeDefined();
        expect(attributes.deletedAt).toBeDefined();
        expect(attributes.firstName).toBeDefined();
        expect(attributes.fullName).toBeDefined();
        expect(attributes.hashanswer).toBeDefined();
        expect(attributes.hashword).toBeDefined();
        expect(attributes.isAdmin).toBeDefined();
        expect(attributes.isSuperAdmin).toBeDefined();
        expect(attributes.lastName).toBeDefined();
        expect(attributes.optInBeta).toBeDefined();
        expect(attributes.restrictions).toBeDefined();
        expect(attributes.roles).toBeDefined();
        expect(attributes.securityQuestion).toBeDefined();
        expect(attributes.token).toBeDefined();
        expect(attributes.tokenExp).toBeDefined();
        expect(attributes.updatedAt).toBeDefined();
        expect(attributes.username).toBeDefined();
      });

      it('should have associations', () => {
        // arrange
        // act
        // assert
        expect(UserModel.associations).toHaveProperty('devices');
        expect(UserModel.associations).toHaveProperty('emails');
        expect(UserModel.associations).toHaveProperty('phones');
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.countDevices).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.hasEmail).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.hasDevices).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.setDevices).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.addDevice).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.addDevices).toBeDefined();

        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.countEmails).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.hasEmail).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.hasEmails).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.setEmails).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.addEmail).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.addEmails).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.removeEmail).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.removeEmails).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.createEmail).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.countPhones).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.createPhone).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.hasPhone).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.hasPhones).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.setPhones).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.addPhone).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.addPhones).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.removePhone).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserModel.prototype?.removePhones).toBeDefined();
      });

      it('should have static methods', () => {
        // arrange
        // act
        // assert
        expect(UserModel.registerAndCreateFromEmail).toBeDefined();
        expect(UserModel.loginWithPassword).toBeDefined();
        expect(UserModel.loginWithUsernamePassword).toBeDefined();
        expect(UserModel.userHasRole).toBeDefined();
        expect(UserModel.isUsernameAvailable).toBeDefined();
        expect(UserModel.createFromUsername).toBeDefined();
        expect(UserModel.updateToken).toBeDefined();
        expect(UserModel.setPasswordTest).toBeDefined();
        expect(UserModel.updatePassword).toBeDefined();
        expect(UserModel.getBiomAuthKey).toBeDefined();
        expect(UserModel.getByRefreshToken).toBeDefined();
        expect(UserModel.getUserSessionData).toBeDefined();
        expect(UserModel.clearRefreshTokens).toBeDefined();
        expect(UserModel.updateRefreshToken).toBeDefined();
      });
    });

    describe('UserPrivilegeSetModel', () => {
      it('should exist when imported', () => {
        // arange
        // act
        // assert
        expect(UserPrivilegeSetModel).toBeDefined();
        expect(UserPrivilegeSetModel.isInitialized).toBeTruthy();
        expect(UserPrivilegeSetModel.name).toEqual(
          USER_PRIVILEGES_POSTGRES_DB_NAME
        );
        expect(UserPrivilegeSetModel.primaryKeyAttribute).toEqual('id');
      });

      it('should have required attributes', () => {
        // arrange
        const attributes = UserPrivilegeSetModel.getAttributes();
        // act
        // assert
        expect(attributes.createdAt).toBeDefined();
        expect(attributes.description).toBeDefined();
        expect(attributes.name).toBeDefined();
        expect(attributes.order).toBeDefined();
        expect(attributes.updatedAt).toBeDefined();
      });
    });
  } else {
    describe('UserModel', () => {
      it('should exist when imported', () => {
        // arange
        // act
        // assert
        expect(UserModel).toBeDefined();
      });
    });
    describe('UserPrivilegeSetModel', () => {
      it('should exist when imported', () => {
        // arange
        // act
        // assert
        expect(UserPrivilegeSetModel).toBeDefined();
      });
    });
  }
});
