import { Sequelize } from 'sequelize-typescript';

import { ApiLoggingClass } from '@dx/logger';
import {
  isLocal,
  POSTGRES_URI,
  TEST_COUNTRY_CODE,
  TEST_EMAIL,
  TEST_EXISTING_EMAIL,
  TEST_EXISTING_PASSWORD,
  TEST_EXISTING_PHONE,
  TEST_PASSWORD,
  TEST_PHONE,
  TEST_PHONE_IT_INVALID,
  TEST_PHONE_VALID
} from '@dx/config';
import { PostgresDbConnection } from '@dx/postgres';
import { RedisService } from '@dx/redis';
import {
  UserModel,
  UserPrivilegeSetModel,
  UserProfileStateType
} from '@dx/user';
import { EmailModel } from '@dx/email';
import { PhoneModel } from '@dx/phone';
import { ShortLinkModel } from '@dx/shortlink';
import {
  AccountCreationPayloadType,
  LoginPaylodType,
  SessionData,
  UserLookupQueryType,
  UserLookupResponseType
} from '../model/auth.types';
import {
  AuthService,
  AuthServiceType
} from './auth.service';
import { USER_LOOKUPS } from '../model/auth.consts';

jest.mock('@dx/logger');

describe('AuthService', () => {
  if (isLocal()) {
    let authService: AuthServiceType;
    let db: Sequelize;
    let emailAccountId: string;
    let phoneAccountId: string;
    let session: SessionData = {};

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
      new RedisService({
        isLocal: true,
        redis: {
          port: 6379,
          prefix: 'dx',
          url: 'redis://redis'
        }
      });
    });

    beforeEach(() => {
      authService = new AuthService();
    });

    afterAll(async () => {
      if (emailAccountId) {
        await UserModel.removeUser(emailAccountId);
      }
      if (phoneAccountId) {
        await UserModel.removeUser(phoneAccountId);
      }
      jest.clearAllMocks();
      await db.close();
    });

    it('should exist when imported', () => {
      expect(AuthService).toBeDefined();
    });

    it('should exist when instantiated', () => {
      // arrange
      // act
      // assert
      expect(authService).toBeDefined();
    });

    describe('createAccount', () => {
      it('should exist', () => {
        // arrange
        // act
        // assert
        expect(authService.createAccount).toBeDefined();
      });

      test('should throw when value does not exist', async () => {
        // arrange
        const payload: AccountCreationPayloadType = {
          code: '',
          value: ''
        };
        // act
        try {
          expect(await authService.createAccount(payload, session)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('Bad data sent.');
        }
      });

      test('should throw when email is not available', async () => {
        // arrange
        const payload: AccountCreationPayloadType = {
          code: 'OU812',
          value: TEST_EXISTING_EMAIL
        };
        // act
        try {
          expect(await authService.createAccount(payload, session)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('Email is unavailable.');
        }
      });

      test('should throw when invalid email sent', async () => {
        // arrange
        const payload: AccountCreationPayloadType = {
          code: 'OU812',
          value: 'not-a-valid-email',
          region: 'US'
        };
        // act
        try {
          expect(await authService.createAccount(payload, session)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual(`Account could not be created with payload: ${JSON.stringify(payload, null, 2)}`);
        }
      });

      test('should throw when phone is not available', async () => {
        // arrange
        const payload: AccountCreationPayloadType = {
          code: 'OU812',
          value: TEST_EXISTING_PHONE,
          region: 'US'
        };
        // act
        try {
          expect(await authService.createAccount(payload, session)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('Phone is unavailable.');
        }
      });

      test('should throw when invalid phone sent', async () => {
        // arrange
        const payload: AccountCreationPayloadType = {
          code: 'OU812',
          value: TEST_PHONE
        };
        // act
        try {
          expect(await authService.createAccount(payload, session)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual(`Account could not be created with payload: ${JSON.stringify(payload, null, 2)}`);
        }
      });

      test('should create an account with email when called', async () => {
        // arrange
        const otpCode = await authService.sendOtpToEmail(TEST_EMAIL);
        const payload: AccountCreationPayloadType = {
          code: otpCode,
          value: TEST_EMAIL
        };
        // act
        const user = await authService.createAccount(payload, session);
        // assert
        expect(user).toBeDefined();
        expect((user as UserProfileStateType).emails).toHaveLength(1);

        emailAccountId = user.id;
      });

      test('should create an account with phone when called', async () => {
        // arrange
        const otpCode = await authService.sendOtpToPhone(TEST_PHONE_VALID, 'US');
        const payload: AccountCreationPayloadType = {
          code: otpCode,
          value: TEST_PHONE_VALID
        };
        // act
        const user = await authService.createAccount(payload, session);
        // assert
        expect(user).toBeDefined();
        expect((user as UserProfileStateType).phones).toHaveLength(1);
        // clenup
        phoneAccountId = user.id;
      });
    });

    describe('doesEmailPhoneExist', () => {
      it('should exist', () => {
        expect(authService.doesEmailPhoneExist).toBeDefined();
      });

      test('should return true when phone does not exist', async () => {
        // arrange
        let response: void | null | UserLookupResponseType = null;
        const expectedResult: UserLookupResponseType = { available: true };
        const query: UserLookupQueryType = {
          code: '1',
          region: 'US',
          value: '8586844802',
          type: USER_LOOKUPS.PHONE
        }
        // act
        response = await authService.doesEmailPhoneExist(query);
        // assert
        expect(response).toEqual(expectedResult);
      });

      test('should return false when phone does exist', async () => {
        // arrange
        let response: void | null | UserLookupResponseType = null;
        const expectedResult: UserLookupResponseType = { available: false };
        const query: UserLookupQueryType = {
          code: TEST_COUNTRY_CODE,
          value: TEST_EXISTING_PHONE,
          type: USER_LOOKUPS.PHONE
        };
        // act
        response = await authService.doesEmailPhoneExist(query);
        // assert
        expect(response).toEqual(expectedResult);
      });

      test('should throw when invalid phone number is sent', async () => {
        // arrange
        const query: UserLookupQueryType = {
          region: 'IT',
          value: TEST_PHONE_IT_INVALID,
          type: USER_LOOKUPS.PHONE
        };
        // act
        // assert
        try  {
          expect(await authService.doesEmailPhoneExist(query)).toThrow();
        } catch (err) {
          expect(err.message).toEqual('Error in auth lookup handler: This phone cannot be used.');
        }
      });

      test('should return true when email does not exist', async () => {
        // arrange
        let response: void | null | UserLookupResponseType = null;
        const expectedResult: UserLookupResponseType = { available: true };
        const query: UserLookupQueryType = {
          value: 'dud.dx.software@gmail.com',
          type: USER_LOOKUPS.EMAIL
        };
        // act
        response = await authService.doesEmailPhoneExist(query);
        // assert
        expect(response).toEqual(expectedResult);
      });

      test('should return false when email does exist', async () => {
        // arrange
        let response: void | null | UserLookupResponseType = null;
        const expectedResult: UserLookupResponseType = { available: false };
        const query: UserLookupQueryType = {
          value: TEST_EXISTING_EMAIL,
          type: USER_LOOKUPS.EMAIL
        }
        // act
        response = await authService.doesEmailPhoneExist(query);
        // assert
        expect(response).toEqual(expectedResult);
      });

      test('should throw when disposable email domain is sent', async () => {
        // arrange
        const query: UserLookupQueryType = {
          value: 'email@080mail.com',
          type: USER_LOOKUPS.EMAIL
        };
        // act
        // assert
        try  {
          expect(await authService.doesEmailPhoneExist(query)).toThrow();
        } catch (err) {
          expect(err.message).toEqual('Error in auth lookup handler: Invalid email domain.');
        }
      });

      test('should throw when email is invalid', async () => {
        // arrange
        const query: UserLookupQueryType = {
          value: 'not a valid email',
          type: USER_LOOKUPS.EMAIL
        };
        // act
        // assert
        try  {
          expect(await authService.doesEmailPhoneExist(query)).toThrow();
        } catch (err) {
          expect(err.message).toEqual('Error in auth lookup handler: Invalid Email.');
        }
      });
    });

    describe('validateEmail', () => {
      it('should exist', () => {
        expect(authService.validateEmail).toBeDefined();
      });

      test('should throw when token does not exist', async () => {
        // arrange
        // act
        try {
          expect(await authService.validateEmail('')).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('No token to validate.');
        }
      });

      test('should throw when token is expired', async () => {
        // arrange
        const token = '413c78fb890955a86d3971828dd05a9b2d844e44d8a30d406f80bf6e79612bb97e8b3b5834c8dbebdf5c4dadc767a579';
        // act
        try {
          expect(await authService.validateEmail(token)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('Token is invalid');
        }
      });
    });

    describe('login', () => {
      it('should exist', () => {
        expect(authService.login).toBeDefined();
      });

      test('should throw when email does not exist', async () => {
        // arrange
        const payload: LoginPaylodType = {
          value: 'not-in-this-system@useless.com',
          password: '',
        };
        // act
        try {
          expect(await authService.login(payload)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('Could not log you in.');
        }
      });

      test('should throw when phone does not exist', async () => {
        // arrange
        const payload: LoginPaylodType = {
          value: '8584846802',
          code: 'OU812',
        };
        // act
        try {
          expect(await authService.login(payload)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('Could not log you in.');
        }
      });

      test('should throw when password is incorrect', async () => {
        // arrange
        const payload: LoginPaylodType = {
          value: TEST_EXISTING_EMAIL,
          password: TEST_PASSWORD,
        };
        // act
        try {
          expect(await authService.login(payload)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('Could not log you in.');
        }
      });

      test('should return user profile upon successful email, passwordless login', async () => {
        // arrange
        const otpCode = await authService.sendOtpToEmail(TEST_EMAIL);
        const payload: LoginPaylodType = {
          code: otpCode,
          value: TEST_EMAIL,
        };
        // act
        const user = await authService.login(payload);
        // console.log(user);
        // assert
        expect(user).toBeDefined();
        expect((user as UserProfileStateType).emails).toHaveLength(1);
      });

      test('should return user profile upon successful email/password login', async () => {
        // arrange
        const payload: LoginPaylodType = {
          value: TEST_EXISTING_EMAIL,
          password: TEST_EXISTING_PASSWORD,
        };
        // act
        const user = await authService.login(payload);
        // console.log(user);
        // assert
        expect(user).toBeDefined();
        expect((user as UserProfileStateType).emails).toHaveLength(1);
        expect((user as UserProfileStateType).phones).toHaveLength(1);
      });

      test('should return user profile upon successful phone login', async () => {
        // arrange
        const otpCode = await authService.sendOtpToPhone(TEST_PHONE_VALID, 'US');
        const payload: LoginPaylodType = {
          value: TEST_PHONE_VALID,
          code: otpCode,
        };
        // act
        const user = await authService.login(payload);
        // console.log(user);
        // assert
        expect(user).toBeDefined();
        expect((user as UserProfileStateType).phones).toHaveLength(1);
      });
    });

    describe('sendOtpToEmail', () => {
      it('should exist', () => {
        expect(authService.sendOtpToEmail).toBeDefined();
      });

      test('should throw when email does not exist', async () => {
        // arrange
        // act
        try {
          expect(await authService.sendOtpToEmail('')).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('No email sent.');
        }
      });

      test('should return undefined when email is invalid', async () => {
        // arrange
        // act
        const result = await authService.sendOtpToEmail('invalid-email');
        // assert
        expect(result).not.toBeDefined();
      });

      test('should return otp code when email is valid', async () => {
        // arrange
        // act
        const result = await authService.sendOtpToEmail(TEST_EMAIL);
        // assert
        expect(result).toBeTruthy();
      });
    });

    describe('sendOtpToPhone', () => {
      it('should exist', () => {
        expect(authService.sendOtpToPhone).toBeDefined();
      });

      test('should throw when phone does not exist', async () => {
        // arrange
        // act
        try {
          expect(await authService.sendOtpToPhone('')).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('No phone sent.');
        }
      });

      test('should return undefined when phone is invalid', async () => {
        // arrange
        // act
        const result = await authService.sendOtpToPhone(TEST_PHONE);
        // assert
        expect(result).not.toBeDefined();
      });

      test('should return otp code when phone is valid', async () => {
        // arrange
        // act
        const result = await authService.sendOtpToPhone(TEST_PHONE_VALID);
        // assert
        expect(result).toBeTruthy();
      });
    });
  } else {
    it('should exist when imported', () => {
      expect(AuthService).toBeDefined();
    });

    it('should exist when instantiated', () => {
      // arrange
      // act
      const authService = new AuthService();
      // assert
      expect(authService).toBeDefined();
    });

    it('should have all methods', () => {
      // arrange
      // act
      const authService = new AuthService();
      // assert
      expect(authService.createAccount).toBeDefined();
      expect(authService.doesEmailPhoneExist).toBeDefined();
      expect(authService.login).toBeDefined();
      expect(authService.sendOtpToEmail).toBeDefined();
      expect(authService.sendOtpToPhone).toBeDefined();
      expect(authService.validateEmail).toBeDefined();
    });
  }
});
