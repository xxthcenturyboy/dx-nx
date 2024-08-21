import { Sequelize } from 'sequelize-typescript';

import { ApiLoggingClass } from '@dx/logger-api';
import { PostgresDbConnection } from '@dx/data-access-postgres';
import { RedisService } from '@dx/data-access-redis';
import { EmailModel } from '@dx/email-api';
import { PhoneModel } from '@dx/phone-api';
import { ShortLinkModel } from '@dx/shortlink-api';
import { UserModel, UserModelType } from '@dx/user-api';
import { UserPrivilegeSetModel } from '@dx/user-privilege-api';
import {
  TEST_DEVICE,
  TEST_EXISTING_USER_ID,
  TEST_UUID,
} from '@dx/config-shared';
import {
  isLocal,
  POSTGRES_URI
} from '@dx/config-api';
import {
  NOTIFICATION_ERRORS,
  NOTIFICATION_LEVELS
} from '@dx/notifications-shared';
import {
  NotificationService,
  NotificationServiceType
} from './notification.service';
import { NotificationModel } from './notification.postgres-model';

jest.mock('@dx/logger-api');

describe('NotificationService', () => {
  if (isLocal()) {
    let db: Sequelize;
    let service: NotificationServiceType;
    let notificationToDelete: NotificationModel;
    let user: UserModelType;

    beforeAll(async () => {
      new ApiLoggingClass({ appName: 'Unit-Test' });
      const connection = new PostgresDbConnection({
        postgresUri: POSTGRES_URI,
        models: [
          NotificationModel,
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
      service = new NotificationService();
    });

    afterAll(async () => {
      jest.clearAllMocks();
      await db.close();
    });

    it('should exist when imported', () => {
      // arrange
      // act
      // assert
      expect(NotificationService).toBeDefined();
    });

    it('should exist when instantiated', () => {
      // arrange
      // act
      // assert
      expect(service).toBeDefined();
    });

    describe('createAndSend', () => {
      test('should throw when things go wrong', async () => {
        // arrange
        // act
        // assert
        try {
          expect(
            await service.createAndSend('', '', NOTIFICATION_LEVELS.INFO)
          ).toThrow();
        } catch (err) {
          expect(err.message).toContain(
            NOTIFICATION_ERRORS.MISSING_PARAMS
          );
        }
      });

      test('should create when all is good', async () => {
        // arrange
        // act
        const response = await service.createAndSend(user.id, 'test', 'test');
        // assert
        expect(response).toBeTruthy();
        notificationToDelete = response;
      });
    });

    describe('getNotificationsByUserId', () => {
      test('should throw when things go wrong', async () => {
        // arrange
        // act
        // assert
        try {
          expect(
            await service.getNotificationsByUserId('')
          ).toThrow();
        } catch (err) {
          expect(err.message).toContain(
            NOTIFICATION_ERRORS.MISSING_USER_ID
          );
        }
      });

      test('should create get stuff when all is good', async () => {
        // arrange
        // act
        const response = await service.getNotificationsByUserId(user.id);
        // assert
        expect(response).toBeTruthy();
        expect(Array.isArray(response)).toBeTruthy();
      });
    });

    describe('getAppBadgeCount', () => {
      test('should return 1 when queried with user id', async () => {
        // arrange
        // act
        const count = await service.getAppBadgeCount(user.id);
        // assert
        expect(count).toBe(1);
      });
      test('should return 0 when queried without user id', async () => {
        // arrange
        // act
        const count = await service.getAppBadgeCount('');
        // assert
        expect(count).toBe(0);
      });
    });

    describe('markAllAsRead', () => {
      test('should return [1] when called', async () => {
        // arrange
        // act
        const result = await service.markAllAsRead(user.id);
        // assert
        expect(result).toBe([1]);
      });
    });

    describe('markViewed', () => {
      test('should return [1] when called', async () => {
        // arrange
        // act
        const result = await service.markViewed(user.id);
        // assert
        expect(result).toBe([1]);
      });
    });

    describe('markAsRead', () => {
      test('should return [1] when called', async () => {
        // arrange
        // act
        const result = await service.markAsRead(notificationToDelete.id);
        // assert
        expect(result).toBe([1]);
      });
    });

    describe('markAsDismissed', () => {
      test('should return [1] when called', async () => {
        // arrange
        // act
        const result = await service.markAsDismissed(notificationToDelete.id);
        // assert
        expect(result).toBe([1]);
      });
    });

  } else {
    it('should exist when imported', () => {
      // arrange
      // act
      // assert
      expect(NotificationService).toBeDefined();
    });

    it('should exist when instantiated', () => {
      // arrange
      // act
      const notificationService = new NotificationService();
      // assert
      expect(notificationService).toBeDefined();
    });

    it('should have all methods', () => {
      // arrange
      // act
      const service = new NotificationService();
      // assert
      expect(service.getAppBadgeCount).toBeDefined();
      expect(service.getNotificationsByUserId).toBeDefined();
      expect(service.createAndSend).toBeDefined();
      expect(service.markAllAsRead).toBeDefined();
      expect(service.markAsDismissed).toBeDefined();
      expect(service.markAsRead).toBeDefined();
      expect(service.markViewed).toBeDefined();
    });
  }
});
