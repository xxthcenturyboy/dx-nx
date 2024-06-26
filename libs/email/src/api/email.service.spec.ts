import { Sequelize } from 'sequelize-typescript';

import { ApiLoggingClass } from '@dx/logger';
import { PostgresDbConnection } from '@dx/postgres';
import {
  EmailService,
  EmailServiceType
} from './email.service';
import { EmailModel } from '../model/email.postgres-model';
import { PhoneModel } from '@dx/phone';
import { ShortLinkModel } from '@dx/shortlink';
import {
  UserModel,
  UserPrivilegeSetModel
} from '@dx/user';
import {
  isLocal,
  POSTGRES_URI
} from '@dx/config';
import {
  CreateEmailPayloadType,
  UpdateEmailPayloadType
} from '../model/email.types';

jest.mock('@dx/logger');

describe('EmailService', () => {
  if (isLocal()) {
    let db: Sequelize
    let emailService: EmailServiceType;
    let emailIdToDelete: string;

    beforeAll(async () => {
      new ApiLoggingClass({ appName: 'Unit-Test' });
      const connection = new PostgresDbConnection({
        postgresUri: POSTGRES_URI,
        models: [
          EmailModel,
          PhoneModel,
          ShortLinkModel,
          UserPrivilegeSetModel,
          UserModel
        ]
      });
      await connection.initialize();
      db = PostgresDbConnection.dbHandle;
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
          def: false,
          email: '',
          label: '',
          userId: ''
        };
        // act
        // assert
        try {
          expect(await emailService.createEmail(payload)).toThrow();
        } catch (err) {
          expect(err.message).toEqual('Not enough information to create an email.');
        }
      });

      test('should throw when the email already exists', async () => {
        // arrange
        const payload: CreateEmailPayloadType = {
          def: false,
          email: 'admin@danex.software',
          label: 'Work',
          userId: '2cf4aebd-d30d-4c9e-9047-e52c10fe8d4d'
        };
        // act
        // assert
        try {
          expect(await emailService.createEmail(payload)).toThrow();
        } catch (err) {
          expect(err.message).toEqual(`This email: ${payload.email} already exists.`);
        }
      });

      test('should throw when the email is not valid', async () => {
        // arrange
        const payload: CreateEmailPayloadType = {
          def: false,
          email: 'not a valid email',
          label: 'Work',
          userId: '2cf4aebd-d30d-4c9e-9047-e52c10fe8d4d'
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
        const payload: CreateEmailPayloadType = {
          def: false,
          email: 'test@test.com',
          label: 'Work',
          userId: '2cf4aebd-d30d-4c9e-9047-e52c10fe8d4d'
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
          expect(err.message).toEqual(`Email could not be found with the id: ${id}`);
        }
      });

      test('should update an email when all is good', async () => {
        // arrange
        const payload: UpdateEmailPayloadType = {
          label: 'Test Label'
        };
        // act
        const response = await emailService.updateEmail(emailIdToDelete, payload);
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
          expect(err.message).toEqual(`Email could not be found with the id: ${id}`);
        }
      });

      test('should set an email deletedAt when all is good', async () => {
        // arrange
        // act
        const response = await emailService.deleteEmail(emailIdToDelete);
        // assert
        expect(response.id).toEqual(emailIdToDelete);
      });
    });

    describe('validateEmail', () => {
      test('should return an empty string when the token is not found.', async () => {
        // arrange
        // act
        const response = await emailService.validateEmail('invalid-token');
        // assert
        expect(response).toEqual({ id: '' });
      });

      test('should throw when the token is not found.', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await emailService.validateEmail('')).toThrow();
        } catch (err) {
          expect(err.message).toEqual('No Token for validate email.');
        }
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
      expect(service.validateEmail).toBeDefined();
    });
  }
});
