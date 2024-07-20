import { Sequelize } from 'sequelize-typescript';

import { PostgresDbConnection } from '@dx/data-access-postgres';
import { ApiLoggingClass } from '@dx/logger-api';
import { UserModel } from '@dx/user-api';
import { UserPrivilegeSetModel } from '@dx/user-privilege-api';
import { DeviceModel } from '@dx/devices-api';
import { PhoneModel } from '@dx/phone-api';
import {
  isLocal,
  POSTGRES_URI
} from '@dx/config-api';
import { EmailModel } from './email.postgres-model';
import { EMAIL_POSTGRES_DB_NAME } from './email.consts';

jest.mock('@dx/logger-api');

describe('EmailModel', () => {
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

    it('should exist when initialized', () => {
      // arange
      // act
      // assert
      expect(EmailModel).toBeDefined();
      expect(EmailModel.isInitialized).toBeTruthy();
      expect(EmailModel.name).toEqual(EMAIL_POSTGRES_DB_NAME);
      expect(EmailModel.primaryKeyAttribute).toEqual('id');
    });

    it('should have required attributes', () => {
      // arrange
      const attributes = EmailModel.getAttributes();
      // act
      // assert
      expect(attributes.createdAt).toBeDefined();
      expect(attributes.default).toBeDefined();
      expect(attributes.deletedAt).toBeDefined();
      expect(attributes.email).toBeDefined();
      expect(attributes.isDeleted).toBeDefined();
      expect(attributes.isVerified).toBeDefined();
      expect(attributes.label).toBeDefined();
      expect(attributes.lastSgMessageId).toBeDefined();
      expect(attributes.lastVerificationSentAt).toBeDefined();
      expect(attributes.token).toBeDefined();
      expect(attributes.updatedAt).toBeDefined();
      expect(attributes.userId).toBeDefined();
      expect(attributes.verifiedAt).toBeDefined();
    });

    it('should have static methods', () => {
      // arrange
      // act
      // assert
      expect(EmailModel.clearAllDefaultByUserId).toBeDefined();
      expect(EmailModel.createOrFindOneByUserId).toBeDefined();
      expect(EmailModel.findAllByUserId).toBeDefined();
      expect(EmailModel.isEmailAvailable).toBeDefined();
      expect(EmailModel.updateMessageInfo).toBeDefined();
      expect(EmailModel.updateMessageInfoValidate).toBeDefined();
      expect(EmailModel.validateEmail).toBeDefined();
      expect(EmailModel.validateEmailWithToken).toBeDefined();
      expect(EmailModel.verifyEmail).toBeDefined();
    });

    it('should have associations', () => {
      // arrange
      // act
      // assert
      expect(EmailModel.associations).toHaveProperty('user');
      // @ts-expect-error - prototype exists
      expect(EmailModel.prototype?.getUser).toBeDefined();
      // @ts-expect-error - prototype exists
      expect(EmailModel.prototype?.setUser).toBeDefined();
      // @ts-expect-error - prototype exists
      expect(EmailModel.prototype?.createUser).toBeDefined();
    });
  } else {
    describe('EmailModel', () => {
      it('should exist when imported', () => {
        // arange
        // act
        // assert
        expect(EmailModel).toBeDefined();
      });
    });
  }
});
