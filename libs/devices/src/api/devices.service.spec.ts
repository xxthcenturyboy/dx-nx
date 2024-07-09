import { Sequelize } from 'sequelize-typescript';

import { ApiLoggingClass } from '@dx/logger';
import { PostgresDbConnection } from '@dx/data-access-api-postgres';
import { RedisService } from '@dx/data-access-api-redis';
import { DevicesService, DevicesServiceType } from './devices.service';
import { DeviceModel } from '../model/device.postgres-model';
import { EmailModel } from '@dx/email';
import { PhoneModel } from '@dx/phone';
import { ShortLinkModel } from '@dx/shortlink';
import { UserModel, UserModelType, UserPrivilegeSetModel } from '@dx/user';
import {
  isLocal,
  TEST_DEVICE,
  TEST_EXISTING_USER_ID,
  TEST_UUID,
} from '@dx/config-shared';
import { POSTGRES_URI } from '@dx/config-api';

jest.mock('@dx/logger');

describe('DevicesService', () => {
  if (isLocal()) {
    let db: Sequelize;
    let service: DevicesServiceType;
    let deviceIdToDelete: string;
    let deviceIdToDelete2: string;
    let badDeviceIdToDelete: string;
    let user: UserModelType;

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
      user = await UserModel.findByPk(TEST_EXISTING_USER_ID);
    });

    beforeEach(() => {
      service = new DevicesService();
    });

    afterAll(async () => {
      jest.clearAllMocks();
      await db.close();
    });

    it('should exist when imported', () => {
      // arrange
      // act
      // assert
      expect(DevicesService).toBeDefined();
    });

    it('should exist when instantiated', () => {
      // arrange
      // act
      // assert
      expect(service).toBeDefined();
    });

    describe('handleDevice', () => {
      test('should throw when things go wrong', async () => {
        // arrange
        // act
        // assert
        try {
          expect(
            await service.handleDevice(TEST_DEVICE, {} as UserModelType)
          ).toThrow();
        } catch (err) {
          expect(err.message).toContain(
            'user.getVerifiedPhone is not a function'
          );
        }
      });

      test('should create a device when all is good', async () => {
        // arrange
        // act
        const response = await service.handleDevice(TEST_DEVICE, user);
        // assert
        expect(response.id).toBeTruthy();
        deviceIdToDelete = response.id;
      });
    });

    describe('updateFcmToken', () => {
      test('should throw when payload is incomplete', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await service.updateFcmToken(TEST_UUID, '')).toThrow();
        } catch (err) {
          expect(err.message).toContain(
            'Update FCM Token: Insufficient data to complete request.'
          );
        }
      });

      test('should throw when user does not exist', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await service.updateFcmToken(TEST_UUID, TEST_UUID)).toThrow();
        } catch (err) {
          expect(err.message).toContain('Update FCM Token: User not found');
        }
      });

      test('should update FCM Token when all is good', async () => {
        // arrange
        // act
        const response = await service.updateFcmToken(
          TEST_EXISTING_USER_ID,
          TEST_UUID
        );
        // assert
        expect(response.id).toBeDefined();
        expect(response.uniqueDeviceId).toEqual(TEST_DEVICE.uniqueDeviceId);
      });
    });

    describe('updatePublicKey', () => {
      test('should throw when payload is incomplete', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await service.updatePublicKey(TEST_UUID, '')).toThrow();
        } catch (err) {
          expect(err.message).toContain(
            'Update Public Key: Insufficient data to complete request.'
          );
        }
      });

      test('should throw when device does not exist', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await service.updatePublicKey(TEST_UUID, 'key')).toThrow();
        } catch (err) {
          expect(err.message).toContain(
            'Update Public Key: Could not find the device to update.'
          );
        }
      });

      test('should update a device when all is good', async () => {
        // arrange
        // act
        const response = await service.updatePublicKey(
          TEST_DEVICE.uniqueDeviceId,
          'biometric-key'
        );
        // assert
        expect(response.id).toBeDefined();
        expect(response.uniqueDeviceId).toEqual(TEST_DEVICE.uniqueDeviceId);
      });
    });

    describe('rejectDevice', () => {
      test('should throw when payload is incomplete', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await service.rejectDevice('')).toThrow();
        } catch (err) {
          expect(err.message).toContain('Reject Device: Token is required');
        }
      });

      test('should throw when device cannot be found with token', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await service.rejectDevice(TEST_UUID)).toThrow();
        } catch (err) {
          expect(err.message).toContain('Reject Device: Invalid Token');
        }
      });

      test('should throw when there are no previous devices', async () => {
        // arrange
        // act
        await DeviceModel.update(
          {
            verificationToken: TEST_UUID,
          },
          {
            where: {
              id: deviceIdToDelete,
            },
          }
        );
        // assert
        try {
          expect(await service.rejectDevice(TEST_UUID)).toThrow();
        } catch (err) {
          expect(err.message).toContain(
            'Reject Device: No previous device exists.'
          );
        }
      });

      test('should return previous device when successful', async () => {
        // arrange
        const badDevice = await DeviceModel.create({
          ...TEST_DEVICE,
          uniqueDeviceId: 'uniquely-bad-device-id',
          verificationToken: 'verification-token',
          userId: user.id,
          verifiedAt: new Date(),
        });
        badDeviceIdToDelete = badDevice.id;
        // act
        const response = await service.rejectDevice('verification-token');
        // assert
        expect(response.id).toBeDefined();
        expect(response.uniqueDeviceId).toEqual(TEST_DEVICE.uniqueDeviceId);
      });
    });

    describe('disconnectDevice', () => {
      test('should throw when no id is passed', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await service.disconnectDevice('')).toThrow();
        } catch (err) {
          expect(err.message).toEqual(
            'DisconnectDevice: Not enough data to execute.'
          );
        }
      });

      test('should throw when the device does not exist', async () => {
        // arrange
        // act
        // assert
        try {
          expect(
            await service.disconnectDevice(TEST_EXISTING_USER_ID)
          ).toThrow();
        } catch (err) {
          expect(err.message).toContain(`Device not found.`);
        }
      });

      test('should set a device deletedAt when all is good', async () => {
        // arrange
        // act
        const response = await service.disconnectDevice(deviceIdToDelete);
        // assert
        expect(response.message).toEqual('Device disconnected.');
      });

      test('should be able to create the exact same device when previous was deletedAt', async () => {
        // arrange
        // act
        const result = await service.handleDevice(TEST_DEVICE, user);
        deviceIdToDelete2 = result.id;
        // assert
        expect(result).toBeDefined();
        expect(result.uniqueDeviceId).toEqual(TEST_DEVICE.uniqueDeviceId);
        expect(result.deletedAt).toBe(null);
      });

      test('should NOT be able to create the exact same device when previous device is still active', async () => {
        // arrange
        // act
        // assert
        try {
          await service.handleDevice(TEST_DEVICE, user);
        } catch (err) {
          expect(err).toBeDefined();
        }
      });

      test('should permantly delete device when called', async () => {
        // arrange
        // act
        await service.deleteTestDevice(deviceIdToDelete);
        await service.deleteTestDevice(deviceIdToDelete2);
        await service.deleteTestDevice(badDeviceIdToDelete);
        // assert
      });
    });
  } else {
    it('should exist when imported', () => {
      // arrange
      // act
      // assert
      expect(DevicesService).toBeDefined();
    });

    it('should exist when instantiated', () => {
      // arrange
      // act
      const devicesService = new DevicesService();
      // assert
      expect(devicesService).toBeDefined();
    });

    it('should have all methods', () => {
      // arrange
      // act
      const service = new DevicesService();
      // assert
      expect(service.handleDevice).toBeDefined();
      expect(service.disconnectDevice).toBeDefined();
      expect(service.rejectDevice).toBeDefined();
      expect(service.updateFcmToken).toBeDefined();
      expect(service.updatePublicKey).toBeDefined();
    });
  }
});
