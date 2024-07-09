import { Sequelize } from 'sequelize-typescript';

import { PostgresDbConnection } from '@dx/postgres';
import { ApiLoggingClass } from '@dx/logger';
import { EmailModel } from '@dx/email';
import { PhoneModel } from '@dx/phone';
import { DeviceModel } from './device.postgres-model';
import { UserModel, UserPrivilegeSetModel } from '@dx/user';
import { DEVICES_POSTGRES_DB_NAME } from './devices.consts';
import { isLocal, POSTGRES_URI } from '@dx/config-shared';

jest.mock('@dx/logger');

describe('Device Model', () => {
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

    describe('DeviceModel', () => {
      it('should exist when initialized', () => {
        // arrange
        // act
        // assert
        expect(DeviceModel).toBeDefined();
        expect(DeviceModel.isInitialized).toBeTruthy();
        expect(DeviceModel.name).toEqual(DEVICES_POSTGRES_DB_NAME);
        expect(DeviceModel.primaryKeyAttribute).toEqual('id');
      });

      it('should have required attributes', () => {
        // arrange
        const attributes = DeviceModel.getAttributes();
        // act
        // assert
        expect(attributes.biomAuthPubKey).toBeDefined();
        expect(attributes.carrier).toBeDefined();
        expect(attributes.createdAt).toBeDefined();
        expect(attributes.deletedAt).toBeDefined();
        expect(attributes.deviceCountry).toBeDefined();
        expect(attributes.deviceId).toBeDefined();
        expect(attributes.facialAuthState).toBeDefined();
        expect(attributes.fcmToken).toBeDefined();
        expect(attributes.id).toBeDefined();
        expect(attributes.name).toBeDefined();
        expect(attributes.uniqueDeviceId).toBeDefined();
        expect(attributes.userId).toBeDefined();
        expect(attributes.verificationToken).toBeDefined();
        expect(attributes.verifiedAt).toBeDefined();
        expect(attributes.hasBiometricSetup).toBeDefined();
      });

      it('should have associations', () => {
        // arrange
        // act
        // assert
        expect(DeviceModel.associations).toHaveProperty('user');
        // @ts-expect-error - prototype exists
        expect(DeviceModel.prototype?.getUser).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(DeviceModel.prototype?.setUser).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(DeviceModel.prototype?.createUser).toBeDefined();
      });

      it('should have static methods', () => {
        // arrange
        // act
        // assert
        expect(DeviceModel.findByFcmToken).toBeDefined();
        expect(DeviceModel.findByFcmTokenNotCurrentUser).toBeDefined();
        expect(DeviceModel.findByVerificationToken).toBeDefined();
        expect(DeviceModel.markDeleted).toBeDefined();
      });
    });
  } else {
    describe('DeviceModel', () => {
      it('should exist when imported', () => {
        // arange
        // act
        // assert
        expect(DeviceModel).toBeDefined();
      });
    });
  }
});
