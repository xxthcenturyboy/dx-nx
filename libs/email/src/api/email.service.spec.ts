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
import { CreateEmailPayloadType } from '../model/email.types';

jest.mock('@dx/logger');

describe('EmailService', () => {
  if (isLocal()) {
    let db: Sequelize
    let emailService: EmailServiceType;

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
      test('should return an empty string when the payload is incomplete', async () => {
        // arrange
        const payload: CreateEmailPayloadType = {
          def: false,
          email: '',
          label: '',
          userId: ''
        };
        // act
        const response = await emailService.createEmail(payload);
        // assert
        expect(response).toEqual({ id: '' });
      });

      test('should return an empty string when the email already exists', async () => {
        // arrange
        const payload: CreateEmailPayloadType = {
          def: false,
          email: 'admin@danex.software',
          label: 'Work',
          userId: '2cf4aebd-d30d-4c9e-9047-e52c10fe8d4d'
        };
        // act
        const response = await emailService.createEmail(payload);
        // assert
        expect(response).toEqual({ id: '' });
      });

      test('should return an empty string when the email is not valid', async () => {
        // arrange
        const payload: CreateEmailPayloadType = {
          def: false,
          email: 'not a valid email',
          label: 'Work',
          userId: '2cf4aebd-d30d-4c9e-9047-e52c10fe8d4d'
        };
        // act
        const response = await emailService.createEmail(payload);
        // assert
        expect(response).toEqual({ id: '' });
      });

      test('should create an email when all is good', async () => {
        // arrange
        const payload: CreateEmailPayloadType = {
          def: false,
          email: 'admin@software.com',
          label: 'Work',
          userId: '2cf4aebd-d30d-4c9e-9047-e52c10fe8d4d'
        };
        // act
        const response = await emailService.createEmail(payload);
        // assert
        expect(response.id).toBeTruthy()
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

      test('should return an empty string when the token is not found.', async () => {
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
      expect(service.validateEmail).toBeDefined();
    });
  }
});
