import { Sequelize } from 'sequelize-typescript';

import { ApiLoggingClass } from '@dx/logger';
import { PostgresDbConnection } from '@dx/data-access-api-postgres';
import { RedisService } from '@dx/data-access-api-redis';
import { UserService, UserServiceType } from './user.service';
import { PhoneModel } from '@dx/phone';
import { DeviceModel } from '@dx/devices';
import { EmailModel } from '@dx/email';
import { ShortLinkModel } from '@dx/shortlink';
import { UserPrivilegeSetModel } from '../model/user-privilege.postgres-model';
import { UserModel } from '../model/user.postgres-model';
import {
  isLocal,
  TEST_EXISTING_EMAIL,
  TEST_EXISTING_USER_ID,
  TEST_PASSWORD,
  TEST_USER_CREATE,
  TEST_UUID,
} from '@dx/config-shared';
import { POSTGRES_URI } from '@dx/config-api';
import {
  UpdatePasswordPayloadType,
  UpdateUserPayloadType,
  UpdateUsernamePayloadType,
  UserProfileStateType,
} from '../model/user.types';

jest.mock('@dx/logger');

describe('UserService', () => {
  if (isLocal()) {
    let db: Sequelize;
    let otpEmail: string;
    let service: UserServiceType;
    let idToUpdate: string;

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
      service = new UserService();
    });

    afterAll(async () => {
      await EmailModel.validateEmail(TEST_EXISTING_EMAIL);
      await service.deleteTestUser(idToUpdate);
      jest.clearAllMocks();
      await db.close();
    });

    it('should exist when imported', () => {
      // arrange
      // act
      // assert
      expect(UserService).toBeDefined();
    });

    it('should exist when instantiated', () => {
      // arrange
      // act
      // assert
      expect(service).toBeDefined();
    });

    describe('getProfile', () => {
      test('should return null object when id not passed', async () => {
        // arrange
        // act
        const result = await service.getProfile('');
        // assert
        expect(result).toBeDefined();
        expect(result.profile).toBeNull();
      });

      test('should get the user Profile when invokced', async () => {
        // arrange
        // act
        const result = await service.getProfile(TEST_EXISTING_USER_ID);
        // assert
        expect(result).toBeDefined();
        expect(result.profile).toBeDefined();
        expect((result.profile as UserProfileStateType).id).toEqual(
          TEST_EXISTING_USER_ID
        );
      });
    });

    describe('createUser', () => {
      test('should throw when missing username or email', async () => {
        // arrange
        const payload = {
          ...TEST_USER_CREATE,
          username: '',
          email: '',
        };
        // act
        // assert
        try {
          expect(await service.createUser(payload)).toThrow();
        } catch (err) {
          expect(err.message).toEqual(
            'Not enough information to create a user.'
          );
        }
      });

      test('should create the user when executed', async () => {
        // arrange
        // act
        const result = await service.createUser(TEST_USER_CREATE);
        // assert
        expect(result).toBeDefined();
        expect(result.id).toBeDefined();
        expect(result.invited).toEqual(true);

        idToUpdate = result.id;
      });
    });

    describe('updateRolesRestrictions', () => {
      test('should throw when missing id', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await service.updateRolesAndRestrictions('', {})).toThrow();
        } catch (err) {
          expect(err.message).toEqual('No id for update user.');
        }
      });

      test('should update the roles and restrictions when executed', async () => {
        // arrange
        const payload: UpdateUserPayloadType = {
          roles: ['USER'],
          restrictions: [],
        };
        // act
        const result = await service.updateRolesAndRestrictions(
          idToUpdate,
          payload
        );
        // assert
        expect(result).toBeDefined();
        expect(result.userId).toEqual(idToUpdate);
      });
    });

    describe('updateUser', () => {
      test('should throw when missing id', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await service.updateUser('', {})).toThrow();
        } catch (err) {
          expect(err.message).toEqual('No id for update user.');
        }
      });

      test('should update the user when executed', async () => {
        // arrange
        const payload: UpdateUserPayloadType = {
          firstName: 'Thomas',
          lastName: 'Jefferson',
        };
        // act
        const result = await service.updateUser(idToUpdate, payload);
        // assert
        expect(result).toBeDefined();
        expect(result.userId).toEqual(idToUpdate);
      });
    });

    describe('getUser', () => {
      test('should throw when id not passed', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await service.getUser('')).toThrow();
        } catch (err) {
          expect(err.message).toEqual('No id provided searching users.');
        }
      });

      test('should throw when user does not exist', async () => {
        // arrange
        const log = jest.spyOn(console, 'log').mockImplementation(() => {});
        // act
        // assert
        try {
          expect(await service.getUser(TEST_UUID)).toThrow();
        } catch (err) {
          expect(err.message).toEqual('Search for user failed.');
        }

        log.mockRestore();
      });

      test('should get the user when existing id is passed', async () => {
        // arrange
        const log = jest.spyOn(console, 'log').mockImplementation(() => {});
        // act
        const result = await service.getUser(TEST_EXISTING_USER_ID);
        // assert
        expect(result).toBeDefined();
        expect(result.id).toEqual(TEST_EXISTING_USER_ID);

        log.mockRestore();
      });
    });

    describe('getUserList', () => {
      test('should get a list of users when existing query is run', async () => {
        // arrange
        const log = jest.spyOn(console, 'log').mockImplementation(() => {});
        // act
        const result = await service.getUserList({});
        // assert
        expect(result).toBeDefined();
        expect(result.count).toBeDefined();
        expect(result.rows).toBeDefined();
        expect(Array.isArray(result.rows)).toBeDefined();
        expect(result.rows[0].id).toEqual(TEST_EXISTING_USER_ID);

        log.mockRestore();
      });
    });

    describe('isUsernameAvailable', () => {
      test('should return true when username does not exist', async () => {
        // arrange
        let response: { available: boolean } | null = null;
        const expectedResult = { available: true };

        // act
        response = await service.isUsernameAvailable('non-existent-username');
        // assert
        expect(response).toEqual(expectedResult);
      });

      test('should throw when profanity is used', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await service.isUsernameAvailable('asshole')).toThrow();
        } catch (err) {
          expect(err.message).toEqual('Profanity is not allowed');
        }
      });

      test('should return false when username does exist', async () => {
        // arrange
        let response: { available: boolean } | null = null;
        const expectedResult = { available: false };
        // act
        response = await service.isUsernameAvailable('admin');
        // assert
        expect(response).toEqual(expectedResult);
      });
    });

    describe('updateUserName', () => {
      test('should throw when missing id', async () => {
        // arrange
        const payload: UpdateUsernamePayloadType = {
          otpCode: 'code',
          username: 'username',
        };
        // act
        // assert
        try {
          expect(await service.updateUserName('', payload)).toThrow();
        } catch (err) {
          expect(err.message).toEqual('No id for update username.');
        }
      });

      test('should throw when profanity is used', async () => {
        // arrange
        otpEmail = (await service.sendOtpCode(idToUpdate)).code;
        const payload: UpdateUsernamePayloadType = {
          otpCode: otpEmail,
          username: 'Asshole',
        };
        // act
        // assert
        try {
          expect(await service.updateUserName(idToUpdate, payload)).toThrow();
        } catch (err) {
          expect(err.message).toEqual('Profanity is not allowed');
        }
      });

      test('should throw when username is unavailable', async () => {
        // arrange
        otpEmail = (await service.sendOtpCode(idToUpdate)).code;
        const payload: UpdateUsernamePayloadType = {
          otpCode: otpEmail,
          username: 'admin',
        };
        // act
        // assert
        try {
          expect(await service.updateUserName(idToUpdate, payload)).toThrow();
        } catch (err) {
          expect(err.message).toEqual('Username is not available.');
        }
      });

      test('should update the username when executed', async () => {
        // arrange
        otpEmail = (await service.sendOtpCode(idToUpdate)).code;
        const payload: UpdateUsernamePayloadType = {
          otpCode: otpEmail,
          username: 'Superman',
        };
        // act
        const result = await service.updateUserName(idToUpdate, payload);
        // assert
        expect(result).toBeDefined();
        expect(result.userId).toEqual(idToUpdate);
      });
    });

    // describe('resendInvite', () => {
    //   test('should throw when sent without payload.', async () => {
    //     // arrange
    //     // act
    //     // assert
    //     try  {
    //       expect(await service.resendInvite({ id: '', email: '' })).toThrow();
    //     } catch (err) {
    //       expect(err.message).toEqual('Request is invalid.');
    //     }
    //   });

    //   test('should throw when email is invalid', async () => {
    //     // arrange
    //     const payload: ResendInvitePayloadType = {
    //       id: idToUpdate,
    //       email: 'not-valid-email'
    //     };
    //     // act
    //     // assert
    //     try  {
    //       expect(await service.resendInvite(payload)).toThrow();
    //     } catch (err) {
    //       expect(err.message).toEqual('The email you provided is not valid.');
    //     }
    //   });

    //   test('should send the invite when sent', async () => {
    //     // arrange
    //     const payload: ResendInvitePayloadType = {
    //       id: idToUpdate,
    //       email: TEST_EMAIL
    //     };
    //     // act
    //     const result = await service.resendInvite(payload);
    //     // assert
    //     expect(result).toBeDefined();
    //     expect(result.invited).toBe(true);
    //   });
    // });

    describe('sendOtpCode', () => {
      test('should throw when sent without id.', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await service.sendOtpCode('')).toThrow();
        } catch (err) {
          expect(err.message).toEqual('Request is invalid.');
        }
      });

      test('should throw when id is wrong', async () => {
        // arrange
        // act
        const code = await service.sendOtpCode(TEST_UUID);
        // assert
        expect(code.code).toBeUndefined();
      });

      test('should send the code when sent', async () => {
        // arrange
        // act
        otpEmail = (await service.sendOtpCode(idToUpdate)).code;
        // assert
        expect(otpEmail).toBeDefined();
        expect(typeof otpEmail === 'string').toBe(true);
      });
    });

    describe('updatePassword', () => {
      beforeAll(async () => {
        await UserModel.setPasswordTest(
          idToUpdate,
          TEST_PASSWORD,
          'Name',
          'What is your name?'
        );
      });

      test('should throw when sent without payload.', async () => {
        // arrange
        const payload: UpdatePasswordPayloadType = {
          id: '',
          password: '',
          passwordConfirm: '',
          otpCode: '',
        };
        // act
        // assert
        try {
          expect(await service.updatePassword(payload)).toThrow();
        } catch (err) {
          expect(err.message).toEqual('Request is invalid.');
        }
      });

      test('should throw when sent a weak password.', async () => {
        // arrange
        const payload: UpdatePasswordPayloadType = {
          id: idToUpdate,
          password: 'password',
          passwordConfirm: 'password',
          otpCode: otpEmail,
        };
        // act
        // assert
        try {
          expect(await service.updatePassword(payload)).toThrow();
        } catch (err) {
          expect(err.message).toContain('Please choose a stronger password.');
        }
      });

      test('should update Password when sent', async () => {
        // arrange
        otpEmail = (await service.sendOtpCode(idToUpdate)).code;

        const payload: UpdatePasswordPayloadType = {
          id: idToUpdate,
          password: 'JS(*#Jlal__lld9iqe',
          passwordConfirm: 'JS(*#Jlal__lld9iqe',
          otpCode: otpEmail,
        };
        // act
        const result = await service.updatePassword(payload);
        // assert
        expect(result).toBeDefined();
        expect(result.success).toBe(true);
      });
    });

    describe('deleteUser', () => {
      test('should throw when missing id', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await service.deleteUser('')).toThrow();
        } catch (err) {
          expect(err.message).toEqual('No id for delete user.');
        }
      });

      test('should delete the user when executed', async () => {
        // arrange
        // act
        const result = await service.deleteUser(idToUpdate);
        // assert
        expect(result).toBeDefined();
        expect(result.userId).toEqual(idToUpdate);
      });
    });
  } else {
    it('should exist when imported', () => {
      expect(UserService).toBeDefined();
    });

    it('should exist when instantiated', () => {
      // arrange
      // act
      const service = new UserService();
      // assert
      expect(service).toBeDefined();
    });

    it('should exist have the correct methods', () => {
      // arrange
      // act
      const service = new UserService();
      // assert
      expect(service.createUser).toBeDefined();
      expect(service.deleteUser).toBeDefined();
      expect(service.getProfile).toBeDefined();
      expect(service.getUser).toBeDefined();
      expect(service.getUserList).toBeDefined();
      // expect(service.resendInvite).toBeDefined();
      expect(service.sendOtpCode).toBeDefined();
      expect(service.updatePassword).toBeDefined();
      expect(service.updateUser).toBeDefined();
    });
  }
});
