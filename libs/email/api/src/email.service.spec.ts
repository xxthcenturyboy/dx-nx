import { Sequelize } from 'sequelize-typescript';

import { ApiLoggingClass } from '@dx/logger-api';
import { PostgresDbConnection } from '@dx/data-access-postgres';
import { RedisService } from '@dx/data-access-redis';
import { DeviceModel } from '@dx/devices-api';
import { PhoneModel } from '@dx/phone-api';
import { ShortLinkModel } from '@dx/shortlink-api';
import { UserModel } from '@dx/user-api';
import { UserPrivilegeSetModel } from '@dx/user-privilege-api';
import {
  TEST_EMAIL,
  TEST_EXISTING_EMAIL,
  TEST_EXISTING_USER_ID,
} from '@dx/config-shared';
import {
  isLocal,
  POSTGRES_URI
} from '@dx/config-api';
import { UserService } from '@dx/user-api';
import { CreateEmailPayloadType, UpdateEmailPayloadType } from '@dx/email-shared';
import { EmailService, EmailServiceType } from './email.service';
import { EmailModel } from './email.postgres-model';

jest.mock('@dx/logger-api');

describe('EmailService', () => {
  if (isLocal()) {
    let db: Sequelize;
    let emailService: EmailServiceType;
    let emailIdToDelete: string;

    beforeAll(async () => {
      new ApiLoggingClass({ appName: 'Unit-Test' });
      const connection = new PostgresDbConnection({
        postgresUri: POSTGRES_URI,
        models: [
          DeviceModel,
          EmailModel,
          PhoneModel,
          ShortLinkModel,
          UserPrivilegeSetModel,
          UserModel,
        ],
      });
      await connection.initialize();
      db = PostgresDbConnection.dbHandle;
      new RedisService({
        isLocal: true,
        redis: {
          port: 6379,
          prefix: 'dx',
          url: 'redis://redis',
        },
      });
    });

    beforeEach(() => {
      emailService = new EmailService();
    });

    afterAll(async () => {
      jest.clearAllMocks();
      await db.close();
    });

    it('should exist when imported', () => {
      // arrange
      // act
      // assert
      expect(EmailService).toBeDefined();
    });

    it('should exist when instantiated', () => {
      // arrange
      // act
      // assert
      expect(emailService).toBeDefined();
    });

    describe('createEmail', () => {
      test('should throw when the payload is incomplete', async () => {
        // arrange
        const payload: CreateEmailPayloadType = {
          code: '',
          def: false,
          email: '',
          label: '',
          userId: '',
        };
        // act
        // assert
        try {
          expect(await emailService.createEmail(payload)).toThrow();
        } catch (err) {
          expect(err.message).toEqual(
            'Not enough information to create an email.'
          );
        }
      });

      test('should throw when the email already exists', async () => {
        // arrange
        const payload: CreateEmailPayloadType = {
          code: '',
          def: false,
          email: TEST_EXISTING_EMAIL,
          label: 'Work',
          userId: TEST_EXISTING_USER_ID,
        };
        // act
        // assert
        try {
          expect(await emailService.createEmail(payload)).toThrow();
        } catch (err) {
          expect(err.message).toEqual(
            `This email: ${payload.email} already exists.`
          );
        }
      });

      test('should throw when the email is not valid', async () => {
        // arrange
        const payload: CreateEmailPayloadType = {
          code: '',
          def: false,
          email: 'not a valid email',
          label: 'Work',
          userId: TEST_EXISTING_USER_ID,
        };
        // act
        // assert
        try {
          expect(await emailService.createEmail(payload)).toThrow();
        } catch (err) {
          expect(err.message).toEqual('The email you provided is not valid.');
        }
      });

      test('should create an email when all is good', async () => {
        // arrange
        const userService = new UserService();
        const otp = await userService.sendOtpCode(TEST_EXISTING_USER_ID);
        const payload: CreateEmailPayloadType = {
          code: otp.code,
          def: false,
          email: TEST_EMAIL,
          label: 'Work',
          userId: TEST_EXISTING_USER_ID,
        };
        // act
        const response = await emailService.createEmail(payload);
        // assert
        expect(response.id).toBeTruthy();
        emailIdToDelete = response.id;
      });
    });

    describe('updateEmail', () => {
      test('should throw when no id is passed', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await emailService.updateEmail('', {})).toThrow();
        } catch (err) {
          expect(err.message).toEqual('No id for update email.');
        }
      });

      test('should throw when the email does not exists', async () => {
        // arrange
        const id = '882972bf-c490-4571-a6ce-a221f0116240';
        // act
        // assert
        try {
          expect(await emailService.updateEmail(id, {})).toThrow();
        } catch (err) {
          expect(err.message).toEqual(
            `Email could not be found with the id: ${id}`
          );
        }
      });

      test('should update an email when all is good', async () => {
        // arrange
        const payload: UpdateEmailPayloadType = {
          label: 'Test Label',
        };
        // act
        const response = await emailService.updateEmail(
          emailIdToDelete,
          payload
        );
        // assert
        expect(response.id).toEqual(emailIdToDelete);
      });
    });

    describe('deleteEmail', () => {
      test('should throw when no id is passed', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await emailService.deleteEmail('')).toThrow();
        } catch (err) {
          expect(err.message).toEqual('No id for delete email.');
        }
      });

      test('should throw when the email does not exists', async () => {
        // arrange
        const id = '882972bf-c490-4571-a6ce-a221f0116240';
        // act
        // assert
        try {
          expect(await emailService.deleteEmail(id)).toThrow();
        } catch (err) {
          expect(err.message).toEqual(
            `Email could not be found with the id: ${id}`
          );
        }
      });

      test('should set an email deletedAt when all is good', async () => {
        // arrange
        // act
        const response = await emailService.deleteEmail(emailIdToDelete);
        // assert
        expect(response.id).toEqual(emailIdToDelete);
      });

      test('should permantly delete email when called', async () => {
        // arrange
        // act
        await emailService.deleteTestEmail(emailIdToDelete);
        // assert
      });
    });
  } else {
    it('should exist when imported', () => {
      // arrange
      // act
      // assert
      expect(EmailService).toBeDefined();
    });

    it('should exist when instantiated', () => {
      // arrange
      // act
      const service = new EmailService();
      // assert
      expect(service).toBeDefined();
    });

    it('should have all methods', () => {
      // arrange
      // act
      const service = new EmailService();
      // assert
      expect(service.createEmail).toBeDefined();
      expect(service.deleteEmail).toBeDefined();
      expect(service.updateEmail).toBeDefined();
    });
  }
});
