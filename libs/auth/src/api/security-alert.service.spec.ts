import { Sequelize } from 'sequelize-typescript';

import { ApiLoggingClass } from '@dx/logger';
import { SecurityAlertSerivice } from './security-alert.service';
import { MailSendgrid } from '@dx/mail';
import {
  isLocal,
  POSTGRES_URI,
  TEST_DEVICE,
  TEST_EXISTING_USER_ID,
  TEST_UUID
} from '@dx/config';
import { PostgresDbConnection } from '@dx/postgres';
import {
  UserModel,
  UserPrivilegeSetModel
} from '@dx/user';
import { DeviceModel } from '@dx/devices';
import { EmailModel } from '@dx/email';
import { PhoneModel } from '@dx/phone';

const spyFetchConnectedDevice = jest.spyOn(UserModel.prototype, 'fetchConnectedDeviceBeforeToken');
const spyVerifiedEmail = jest.spyOn(UserModel.prototype, 'getVerifiedEmail');
const spyVerifiedPhone = jest.spyOn(UserModel.prototype, 'getVerifiedPhone');
const spySendAccountAlert = jest.spyOn(MailSendgrid.prototype, 'sendAccountAlert');

jest.mock('@dx/logger');

describe('SecurityAlertSerivice', () => {
  if (isLocal()) {
    let db: Sequelize;

    beforeAll(async () => {
      new ApiLoggingClass({ appName: 'Unit-Test' });
      const connection = new PostgresDbConnection({
        postgresUri: POSTGRES_URI,
        models: [
          DeviceModel,
          EmailModel,
          PhoneModel,
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

    it('should exist', () => {
      expect(SecurityAlertSerivice).toBeDefined();
    });

    describe('newDeviceNotification', () => {
      test('should exist', async () => {
        // arrange
        // act
        // assert
        expect(SecurityAlertSerivice.newDeviceNotification).toBeDefined();
      });

      test('should sendAccountAlert when called', async () => {
        // arrange
        const user = await UserModel.findByPk(TEST_EXISTING_USER_ID);
        // act
        const result = await SecurityAlertSerivice.newDeviceNotification(user, TEST_DEVICE, TEST_UUID);
        // assert
        expect(spyFetchConnectedDevice).toHaveBeenCalled();
        expect(spyVerifiedEmail).toHaveBeenCalled();
        expect(spyVerifiedPhone).toHaveBeenCalled();
        expect(spySendAccountAlert).toHaveBeenCalled();
      });
    });
  } else {
    it('should exist', () => {
      expect(SecurityAlertSerivice).toBeDefined();
    });

    describe('newDeviceNotification', () => {
      test('should exist', async () => {
        // arrange
        // act
        // assert
        expect(SecurityAlertSerivice.newDeviceNotification).toBeDefined();
      });
    });
  }
});
