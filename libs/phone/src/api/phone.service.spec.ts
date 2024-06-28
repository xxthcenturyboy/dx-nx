import { Sequelize } from 'sequelize-typescript';

import { ApiLoggingClass } from '@dx/logger';
import { PostgresDbConnection } from '@dx/postgres';
import {
  PhoneService,
  PhoneServiceType
} from './phone.service';
import { PhoneModel } from '../model/phone.postgres-model';
import { EmailModel } from '@dx/email';
import { ShortLinkModel } from '@dx/shortlink';
import {
  UserModel,
  UserPrivilegeSetModel
} from '@dx/user';
import {
  isLocal,
  POSTGRES_URI,
  TEST_COUNTRY_CODE,
  TEST_EXISTING_PHONE,
  TEST_EXISTING_USER_ID,
  TEST_PHONE,
  TEST_UUID
} from '@dx/config';
import {
  CreatePhonePayloadType,
  UpdatePhonePayloadType
} from '../model/phone.types';

jest.mock('@dx/logger');

describe('PhoneService', () => {
  if (isLocal()) {
    let db: Sequelize
    let phoneService: PhoneServiceType;
    let idToDelete: string;

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
      phoneService = new PhoneService();
    });

    afterAll(async () => {
      jest.clearAllMocks();
      await db.close();
    });

    it('should exist when imported', () => {
      // arrange
      // act
      // assert
      expect(PhoneService).toBeDefined();
    });

    it('should exist when instantiated', () => {
      // arrange
      // act
      // assert
      expect(phoneService).toBeDefined();
    });

    describe('createPhone', () => {
      test('should throw when the payload is incomplete', async () => {
        // arrange
        const payload: CreatePhonePayloadType = {
          countryCode: '',
          def: false,
          phone: '',
          label: '',
          userId: ''
        };
        // act
        // assert
        try {
          expect(await phoneService.createPhone(payload)).toThrow();
        } catch (err) {
          expect(err.message).toEqual('Not enough information to create a phone.');
        }
      });

      test('should throw when the phone already exists', async () => {
        // arrange
        const payload: CreatePhonePayloadType = {
          countryCode: TEST_COUNTRY_CODE,
          def: false,
          phone: TEST_EXISTING_PHONE,
          label: 'Work',
          userId: TEST_EXISTING_USER_ID
        };
        // act
        // assert
        try {
          expect(await phoneService.createPhone(payload)).toThrow();
        } catch (err) {
          expect(err.message).toEqual(`This phone: ${payload.phone} already exists.`);
        }
      });

      test('should create a phone when all is good', async () => {
        // arrange
        const payload: CreatePhonePayloadType = {
          countryCode: TEST_COUNTRY_CODE,
          def: false,
          phone: TEST_PHONE,
          label: 'Work',
          userId: TEST_EXISTING_USER_ID
        };
        // act
        const response = await phoneService.createPhone(payload);
        // assert
        expect(response.id).toBeTruthy();
        idToDelete = response.id;
      });
    });

    describe('updatePhone', () => {
      test('should throw when no id is passed', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await phoneService.updatePhone('', {})).toThrow();
        } catch (err) {
          expect(err.message).toEqual('No id for update phone.');
        }
      });

      test('should throw when the phone does not exists', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await phoneService.updatePhone(TEST_UUID, {})).toThrow();
        } catch (err) {
          expect(err.message).toEqual(`Phone could not be found with the id: ${TEST_UUID}`);
        }
      });

      test('should update a phone when all is good', async () => {
        // arrange
        const payload: UpdatePhonePayloadType = {
          label: 'Test Label'
        };
        // act
        const response = await phoneService.updatePhone(idToDelete, payload);
        // assert
        expect(response.id).toEqual(idToDelete);
      });
    });

    describe('deletePhone', () => {
      test('should throw when no id is passed', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await phoneService.deletePhone('')).toThrow();
        } catch (err) {
          expect(err.message).toEqual('No id for delete phone.');
        }
      });

      test('should throw when the phone does not exists', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await phoneService.deletePhone(TEST_UUID)).toThrow();
        } catch (err) {
          expect(err.message).toEqual(`Phone could not be found with the id: ${TEST_UUID}`);
        }
      });

      test('should set an phone deletedAt when all is good', async () => {
        // arrange
        // act
        const response = await phoneService.deletePhone(idToDelete);
        // assert
        expect(response.id).toEqual(idToDelete);
      });

      test('should permanently delete a phone when called', async () => {
        // arrange
        // act
        await phoneService.deleteTestPhone(idToDelete);
        // assert
      });
    });
  } else {
    it('should exist when imported', () => {
      // arrange
      // act
      // assert
      expect(PhoneService).toBeDefined();
    });

    it('should exist when instantiated', () => {
      // arrange
      // act
      const service = new PhoneService();
      // assert
      expect(service).toBeDefined();
    });

    it('should have all methods', () => {
      // arrange
      // act
      const service = new PhoneService();
      // assert
      expect(service.createPhone).toBeDefined();
      expect(service.deletePhone).toBeDefined();
      expect(service.updatePhone).toBeDefined();
    });
  }
});
