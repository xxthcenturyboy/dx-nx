import { Sequelize } from 'sequelize-typescript';

import { PostgresDbConnection } from '@dx/postgres';
import { ApiLoggingClass } from '@dx/logger';
import { UserModel, UserPrivilegeSetModel } from '@dx/user';
import { DeviceModel } from '@dx/devices';
import { EmailModel } from '@dx/email';
import { PhoneModel } from './phone.postgres-model';
import { PHONE_POSTGRES_DB_NAME } from './phone.consts';
import { isLocal } from '@dx/config-shared';
import { POSTGRES_URI } from '@dx/config-api';

jest.mock('@dx/logger');

describe('PhoneModel', () => {
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

    it('should exist when imported', () => {
      // arange
      // act
      // assert
      expect(PhoneModel).toBeDefined();
      expect(PhoneModel.isInitialized).toBeTruthy();
      expect(PhoneModel.name).toEqual(PHONE_POSTGRES_DB_NAME);
      expect(PhoneModel.primaryKeyAttribute).toEqual('id');
    });

    it('should have required attributes', () => {
      // arrange
      const attributes = PhoneModel.getAttributes();
      // act
      // assert
      expect(attributes.countryCode).toBeDefined();
      expect(attributes.createdAt).toBeDefined();
      expect(attributes.default).toBeDefined();
      expect(attributes.deletedAt).toBeDefined();
      expect(attributes.isDeleted).toBeDefined();
      expect(attributes.isSent).toBeDefined();
      expect(attributes.isVerified).toBeDefined();
      expect(attributes.label).toBeDefined();
      expect(attributes.phone).toBeDefined();
      expect(attributes.phoneFormatted).toBeDefined();
      expect(attributes.twilioCodeSentAt).toBeDefined();
      expect(attributes.twilioMessageId).toBeDefined();
      expect(attributes.updatedAt).toBeDefined();
      expect(attributes.userId).toBeDefined();
      expect(attributes.verifiedAt).toBeDefined();
    });

    it('should have associations', () => {
      // arrange
      // act
      // assert
      expect(PhoneModel.associations).toHaveProperty('user');
      // @ts-expect-error - prototype exists
      expect(PhoneModel.prototype?.getUser).toBeDefined();
      // @ts-expect-error - prototype exists
      expect(PhoneModel.prototype?.setUser).toBeDefined();
      // @ts-expect-error - prototype exists
      expect(PhoneModel.prototype?.createUser).toBeDefined();
    });

    it('should have static methods', () => {
      // arrange
      // act
      // assert
      expect(PhoneModel.clearAllDefaultByUserId).toBeDefined();
      expect(PhoneModel.createOrFindOneByUserId).toBeDefined();
      expect(PhoneModel.findAllByUserId).toBeDefined();
      expect(PhoneModel.isPhoneAvailable).toBeDefined();
    });
  } else {
    describe('PhoneModel', () => {
      it('should exist when imported', () => {
        // arange
        // act
        // assert
        expect(PhoneModel).toBeDefined();
      });
    });
  }
});
