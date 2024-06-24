import { Sequelize } from 'sequelize-typescript';

import { PostgresDbConnection } from '@dx/postgres';
import { ApiLoggingClass } from '@dx/logger';
import { UserModel } from './user.postgres-model';
import { UserEmailModel } from './user-email.postgres-model';
import { UserPhoneModel } from './user-phone.postgres-model';
import { UserPrivilegeSetModel } from './user-privilege.postgres-model';
import {
  USER_ENTITY_POSTGRES_DB_NAME,
  USER_EMAIL_POSTGRES_DB_NAME,
  USER_PHONE_POSTGRES_DB_NAME,
  USER_PRIVILEGES_POSTGRES_DB_NAME
} from './user.consts';
import {
  isLocal,
  POSTGRES_URI
} from '@dx/config';

jest.mock('@dx/logger');

describe('User Models', () => {
  if (isLocal()) {
    console.log('running local tests: Connects to Postgres db');
    let db: Sequelize;

    beforeAll(async () => {
      new ApiLoggingClass({ appName: 'Unit-Test' });
      const connection = new PostgresDbConnection({
        postgresUri: POSTGRES_URI,
        models: [
          UserEmailModel,
          UserPhoneModel,
          UserPrivilegeSetModel,
          UserModel
        ]
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
        expect(attributes.hasCompletedInvite).toBeDefined();
        expect(attributes.hashanswer).toBeDefined();
        expect(attributes.hashword).toBeDefined();
        expect(attributes.isAdmin).toBeDefined();
        expect(attributes.isSuperAdmin).toBeDefined();
        expect(attributes.lastName).toBeDefined();
        expect(attributes.otpCode).toBeDefined();
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
        expect(UserModel.associations).toHaveProperty('emails');
        expect(UserModel.associations).toHaveProperty('phones');
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
        expect(UserModel.updateOtpCode).toBeDefined();
        expect(UserModel.setPassword).toBeDefined();
        expect(UserModel.updatePassword).toBeDefined();
        expect(UserModel.lockoutOtp).toBeDefined();
      });
    });

    describe('UserEmailModel', () => {
      it('should exist when initialized', () => {
        // arange
        // act
        // assert
        expect(UserEmailModel).toBeDefined();
        expect(UserEmailModel.isInitialized).toBeTruthy();
        expect(UserEmailModel.name).toEqual(USER_EMAIL_POSTGRES_DB_NAME);
        expect(UserEmailModel.primaryKeyAttribute).toEqual('id');
      });

      it('should have required attributes', () => {
        // arrange
        const attributes = UserEmailModel.getAttributes();
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
        expect(UserEmailModel.assertEmailIsValid).toBeDefined();
        expect(UserEmailModel.clearAllDefaultByUserId).toBeDefined();
        expect(UserEmailModel.createOrFindOneByUserId).toBeDefined();
        expect(UserEmailModel.findAllByUserId).toBeDefined();
        expect(UserEmailModel.isEmailAvailable).toBeDefined();
        expect(UserEmailModel.updateMessageInfo).toBeDefined();
        expect(UserEmailModel.updateMessageInfoValidate).toBeDefined();
        expect(UserEmailModel.validateEmail).toBeDefined();
        expect(UserEmailModel.validateEmailWithToken).toBeDefined();
      });

      it('should have associations', () => {
        // arrange
        // act
        // assert
        expect(UserEmailModel.associations).toHaveProperty('user');
        // @ts-expect-error - prototype exists
        expect(UserEmailModel.prototype?.getUser).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserEmailModel.prototype?.setUser).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserEmailModel.prototype?.createUser).toBeDefined();
      });
    });

    describe('UserPhoneModel', () => {
      it('should exist when imported', () => {
        // arange
        // act
        // assert
        expect(UserPhoneModel).toBeDefined();
        expect(UserPhoneModel.isInitialized).toBeTruthy();
        expect(UserPhoneModel.name).toEqual(USER_PHONE_POSTGRES_DB_NAME);
        expect(UserPhoneModel.primaryKeyAttribute).toEqual('id');
      });

      it('should have required attributes', () => {
        // arrange
        const attributes = UserPhoneModel.getAttributes();
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
        expect(UserPhoneModel.associations).toHaveProperty('user');
        // @ts-expect-error - prototype exists
        expect(UserPhoneModel.prototype?.getUser).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserPhoneModel.prototype?.setUser).toBeDefined();
        // @ts-expect-error - prototype exists
        expect(UserPhoneModel.prototype?.createUser).toBeDefined();
      });

      it('should have static methods', () => {
        // arrange
        // act
        // assert
        expect(UserPhoneModel.clearAllDefaultByUserId).toBeDefined();
        expect(UserPhoneModel.createOrFindOneByUserId).toBeDefined();
        expect(UserPhoneModel.findAllByUserId).toBeDefined();
        expect(UserPhoneModel.isPhoneAvailable).toBeDefined();
      });
    });

    describe('UserPrivilegeSetModel', () => {
      it('should exist when imported', () => {
        // arange
        // act
        // assert
        expect(UserPrivilegeSetModel).toBeDefined();
        expect(UserPrivilegeSetModel.isInitialized).toBeTruthy();
        expect(UserPrivilegeSetModel.name).toEqual(USER_PRIVILEGES_POSTGRES_DB_NAME);
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
    console.log('running non-local tests: No db connection or mock');
    describe('UserModel', () => {
      it('should exist when imported', () => {
        // arange
        // act
        // assert
        expect(UserModel).toBeDefined();
      });
    });
    describe('UserEmailModel', () => {
      it('should exist when imported', () => {
        // arange
        // act
        // assert
        expect(UserEmailModel).toBeDefined();
      });
    });
    describe('UserPhoneModel', () => {
      it('should exist when imported', () => {
        // arange
        // act
        // assert
        expect(UserPhoneModel).toBeDefined();
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
