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
  TEST_PASSWORD
} from '@dx/config';
import { PostgresDbConnection } from '@dx/postgres';
import {
  UserModel,
  UserPrivilegeSetModel,
  UserProfileStateType
} from '@dx/user';
import { EmailModel } from '@dx/email';
import { PhoneModel } from '@dx/phone';
import {
  GetByTokenQueryType,
  LoginPaylodType,
  SessionData,
  SignupPayloadType,
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
    let session: SessionData = {};

    beforeAll(async () => {
      new ApiLoggingClass({ appName: 'Unit-Test' });
      const connection = new PostgresDbConnection({
        postgresUri: POSTGRES_URI,
        models: [
          EmailModel,
          PhoneModel,
          UserPrivilegeSetModel,
          UserModel
        ]
      });
      await connection.initialize();
      db = PostgresDbConnection.dbHandle;
    });

    beforeEach(() => {
      authService = new AuthService();
    });

    afterAll(async () => {
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

    describe('doesEmailPhoneUsernameExist', () => {
      it('should exist', () => {
        expect(authService.doesEmailPhoneUsernameExist).toBeDefined();
      });

      test('should return true when phone does not exist', async () => {
        // arrange
        let response: void | null | UserLookupResponseType = null;
        const expectedResult: UserLookupResponseType = { available: true };
        const query: UserLookupQueryType = {
          code: '1',
          value: '2131112221',
          type: USER_LOOKUPS.PHONE
        }
        // act
        response = await authService.doesEmailPhoneUsernameExist(query);
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
        }
        // act
        response = await authService.doesEmailPhoneUsernameExist(query);
        // assert
        expect(response).toEqual(expectedResult);
      });

      test('should return true when email does not exist', async () => {
        // arrange
        let response: void | null | UserLookupResponseType = null;
        const expectedResult: UserLookupResponseType = { available: true };
        const query: UserLookupQueryType = {
          value: 'dud.dx.software@gmail.com',
          type: USER_LOOKUPS.EMAIL
        }
        // act
        response = await authService.doesEmailPhoneUsernameExist(query);
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
        response = await authService.doesEmailPhoneUsernameExist(query);
        // assert
        expect(response).toEqual(expectedResult);
      });

      test('should return true when username does not exist', async () => {
        // arrange
        let response: void | null | UserLookupResponseType = null;
        const expectedResult: UserLookupResponseType = { available: true };
        const query: UserLookupQueryType = {
          value: 'administrator',
          type: USER_LOOKUPS.USERNAME
        }
        // act
        response = await authService.doesEmailPhoneUsernameExist(query);
        // assert
        expect(response).toEqual(expectedResult);
      });

      test('should return false when username does exist', async () => {
        // arrange
        let response: void | null | UserLookupResponseType = null;
        const expectedResult: UserLookupResponseType = { available: false };
        const query: UserLookupQueryType = {
          value: 'admin',
          type: USER_LOOKUPS.USERNAME
        }
        // act
        response = await authService.doesEmailPhoneUsernameExist(query);
        // assert
        expect(response).toEqual(expectedResult);
      });
    });

    describe('getByToken', () => {
      it('should exist', () => {
        expect(authService.getByToken).toBeDefined();
      });

      test('should throw when token does not exist', async () => {
        // arrange
        const query: GetByTokenQueryType = {
          token: 'bad-token'
        };
        // act
        try {
          expect(await authService.getByToken(query)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('Error in auth get user by token handler: No user found with that link.');
        }
      });

      test('should throw when token is expired', async () => {
        // arrange
        const query: GetByTokenQueryType = {
          token: '413c78fb890955a86d3971828dd05a9b2d844e44d8a30d406f80bf6e79612bb97e8b3b5834c8dbebdf5c4dadc767a579'
        };
        // act
        try {
          expect(await authService.getByToken(query)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('Error in auth get user by token handler: Token has expired.');
        }
      });
    });

    describe('lockoutFromOtpEmail', () => {
      it('should exist', () => {
        expect(authService.lockoutFromOtpEmail).toBeDefined();
      });

      test('should throw when id does not exist', async () => {
        // arrange
        // act
        try {
          expect(await authService.lockoutFromOtpEmail('4d2269d3-9bfc-4f2d-b66c-ab63ea1d2c6f')).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toContain('Error in OTP Lockout handler:');
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
          email: 'not-in-this-system@useless.com',
          password: '',
        };
        // act
        try {
          expect(await authService.login(payload)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('This is not a valid username.');
        }
      });

      test('should throw when passwords is incorrect', async () => {
        // arrange
        const payload: LoginPaylodType = {
          email: TEST_EXISTING_EMAIL,
          password: TEST_PASSWORD,
        };
        // act
        try {
          expect(await authService.login(payload)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('Incorrect username or password.');
        }
      });

      test('should return user profile upon successful login', async () => {
        // arrange
        const payload: LoginPaylodType = {
          email: TEST_EXISTING_EMAIL,
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
    });

    describe('requestReset', () => {
      it('should exist', () => {
        expect(authService.requestReset).toBeDefined();
      });

      test('should throw when email does not exist', async () => {
        // arrange
        // act
        try {
          expect(await authService.requestReset('not-in-this-system@useless.com')).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toContain('Could not find');
        }
      });

      test('should throw when no email is sent', async () => {
        // arrange
        // act
        try {
          expect(await authService.requestReset('')).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('Request is invalid.');
        }
      });
    });

    describe('signup', () => {
      const STRONG_PW = 'ajf349234jla_(@kaldj';
      it('should exist', () => {
        expect(authService.signup).toBeDefined();
      });

      test('should throw when email does not exist', async () => {
        // arrange
        const payload: SignupPayloadType = {
          email: '',
          password: '',
          passwordConfirm: ''
        };
        // act
        try {
          expect(await authService.signup(payload, session)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('Email is required.');
        }
      });

      test('should throw when passwords do not match', async () => {
        // arrange
        const payload: SignupPayloadType = {
          email: TEST_EMAIL,
          password: 'password1',
          passwordConfirm: 'not-matching-password'
        };
        // act
        try {
          expect(await authService.signup(payload, session)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('Passwords must match.');
        }
      });

      test('should throw when session is missing', async () => {
        // arrange
        const payload: SignupPayloadType = {
          email: TEST_EMAIL,
          password: 'password1',
          passwordConfirm: 'password1'
        };
        // act
        try {
          expect(await authService.signup(payload, undefined)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('Internal server error: Missing Session.');
        }
      });

      test('should throw when password is weak', async () => {
        // arrange
        const payload: SignupPayloadType = {
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
          passwordConfirm: TEST_PASSWORD
        };
        // act
        try {
          expect(await authService.signup(payload, session)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toContain('Please choose a stronger password.');
        }
      });

      test('should throw when email is not available', async () => {
        // arrange
        const payload: SignupPayloadType = {
          email: TEST_EXISTING_EMAIL,
          password: STRONG_PW,
          passwordConfirm: STRONG_PW
        };
        // act
        try {
          expect(await authService.signup(payload, session)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('Email is already taken.');
        }
      });

      test('should throw when email is invalid', async () => {
        // arrange
        const payload: SignupPayloadType = {
          email: 'invalid email',
          password: STRONG_PW,
          passwordConfirm: STRONG_PW
        };
        // act
        try {
          expect(await authService.signup(payload, session)).toThrow();
        } catch (err) {
          // assert
          expect(err.message).toEqual('invalid email does not appear to be a valid email.');
        }
      });

      test('should create a user when all data is good', async () => {
        // arrange
        const payload: SignupPayloadType = {
          email: TEST_EMAIL,
          password: STRONG_PW,
          passwordConfirm: STRONG_PW
        };
        // act
        const user = await authService.signup(payload, session);
        // assert
        expect(user).toBeDefined();
        expect((user as UserProfileStateType).emails).toHaveLength(1);
        // clenup
        if (user && user.id) {
          await UserModel.removeUser(user.id);
        }
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
      expect(authService.doesEmailPhoneUsernameExist).toBeDefined();
      expect(authService.getByToken).toBeDefined();
      expect(authService.signup).toBeDefined();
    });
  }
});
