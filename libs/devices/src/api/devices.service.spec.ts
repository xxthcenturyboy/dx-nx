import { Sequelize } from 'sequelize-typescript';

import { ApiLoggingClass } from '@dx/logger';
import { PostgresDbConnection } from '@dx/postgres';
import { RedisService } from '@dx/redis';
import {
  DevicesService,
  DevicesServiceType
} from './devices.service';
import { DeviceModel } from '../model/device.postgres-model';
import { EmailModel } from '@dx/email';
import { PhoneModel } from '@dx/phone';
import { ShortLinkModel } from '@dx/shortlink';
import {
  UserModel,
  UserModelType,
  UserPrivilegeSetModel
} from '@dx/user';
import {
  isLocal,
  POSTGRES_URI,
  TEST_DEVICE,
  TEST_EXISTING_USER_ID,
  TEST_UUID
} from '@dx/config';

jest.mock('@dx/logger');

describe('DevicesService', () => {
  if (isLocal()) {
    let db: Sequelize
    let service: DevicesServiceType;
    let deviceIdToDelete: string;
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
          expect(await service.handleDevice(
            TEST_DEVICE,
            {} as UserModelType
          )).toThrow();
        } catch (err) {
          expect(err.message).toContain('user.getVerifiedPhone is not a function');
        }
      });

      test('should create a device when all is good', async () => {
        // arrange
        // act
        const response = await service.handleDevice(
          TEST_DEVICE,
          user
        );
        // assert
        expect(response.id).toBeTruthy();
        deviceIdToDelete = response.id;
      });
    });

    describe('updateDevice', () => {
      test('should throw when payload is incomplete', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await service.updateDevice(
            TEST_UUID,
            ''
          )).toThrow();
        } catch (err) {
          expect(err.message).toContain('Update Device: Insufficient data to complete request.');
        }
      });

      test('should throw when device does not exist', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await service.updateDevice(
            TEST_UUID,
            'key'
          )).toThrow();
        } catch (err) {
          expect(err.message).toContain('Update Device: Could not find the device to update.');
        }
      });

      test('should update a device when all is good', async () => {
        // arrange
        // act
        const response = await service.updateDevice(
          TEST_DEVICE.uniqueDeviceId,
          'biometric-key'
        );
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
          expect(err.message).toEqual('DisconnectDevice: Not enough data to execute.');
        }
      });

      test('should throw when the device does not exist', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await service.disconnectDevice(TEST_EXISTING_USER_ID)).toThrow();
        } catch (err) {
          expect(err.message).toContain(`DeviceModel.markeDeleted: Device not found.`);
        }
      });

      test('should set a device deletedAt when all is good', async () => {
        // arrange
        // act
        const response = await service.disconnectDevice(deviceIdToDelete);
        // assert
        expect(response.message).toEqual('Device disconnected.');
      });

      test('should permantly delete device when called', async () => {
        // arrange
        // act
        await service.deleteTestDevice(deviceIdToDelete);
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
      expect(service.updateDevice).toBeDefined();
    });
  }
});
