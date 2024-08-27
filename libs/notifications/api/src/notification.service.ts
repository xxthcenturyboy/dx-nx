import {
  NOTIFICATION_ERRORS,
  NOTIFICATION_LEVELS
} from '@dx/notifications-shared';
import { UserModel } from '@dx/user-api';
import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger-api';
import { NotificationModel } from './notification.postgres-model';
import { NotificationSocketApiService } from './notificaiton.socket';
import { sleep } from '@dx/utils-shared-misc';
import { NotificationType } from '@dx/notifications-shared';
// import admin from 'firebase-admin';

export class NotificationService {
  logger: ApiLoggingClassType;

  constructor() {
    this.logger = ApiLoggingClass.instance;
  }

  public async getNotificationsByUserId(userId: string): Promise<NotificationModel[]> {
    if (
      !userId
      && typeof userId !== 'string'
    ) {
      throw new Error(NOTIFICATION_ERRORS.MISSING_USER_ID);
    }

    try {
      return await NotificationModel.getByUserId(userId);
    } catch (err) {
      this.logger.logError(err);
      throw new Error(NOTIFICATION_ERRORS.SERVER_ERROR);
    }
  }

  public async getAppBadgeCount(userId: string) {
    try {

      const user = await UserModel.findByPk(userId);
      if (!user) return 0;

      const notifications = await this.getNotificationsByUserId(userId);
      const notificationsCount = notifications.length;

      return notificationsCount;
    } catch (err) {
      this.logger.logError(err);
      return 0;
    }
  }

  private async sendDeviceNotification(
    userId: string,
    message: string,
    title?: string,
    route?: string
  ): Promise<void> {
    try {

      const user = await UserModel.findByPk(userId);
      if (!user) {
        throw 'No User!';
      }

      const badge = await this.getAppBadgeCount(userId);

      // TODO: Implement Device Push
      const device = await user.fetchConnectedDevice();
      // if (device && device.fcmToken) {
        // const tileMessage = title ? title : message;
        // const body = title ? message : '';
        // const routeString = route ? route : '';
        //   await admin.messaging().send({
        //     token: device.fcmToken,
        //     notification: {
        //       title: tileMessage,
        //       body
        //     },
        //     data: {
        //       type: 'DEFAULT_NOTIFICATION',
        //       title: tileMessage,
        //       body,
        //       route: routeString,
        //       badgeCount: badge.toString()
        //     },
        //     apns: {
        //       payload: {
        //         aps: { badge }
        //       }
        //     }
        //   });
      // }

    } catch (err) {
      this.logger.logError(err);
      throw err;
    }
  }

  public async createAndSend(
    userId: string,
    message: string,
    level: string,
    title?: string,
    route?: string,
    suppressPush?: boolean
  ): Promise<NotificationModel> {
    try {
      if (
        !userId
        && !message
      ) {
        throw new Error(NOTIFICATION_ERRORS.MISSING_PARAMS);
      }

      const notification = await NotificationModel.createNew({
        userId,
        route,
        title,
        message,
        level
      });

      NotificationSocketApiService.instance.sendNotification(notification);

      if (!suppressPush) {
        this.sendDeviceNotification(userId, message, title, route);
      }
      return notification;
    } catch (err) {
      this.logger.logError(err);
      throw new Error(NOTIFICATION_ERRORS.SERVER_ERROR);
    }
  }

  public async markAllAsRead(userId: string): Promise<[number]> {
    if (
      !userId
      && typeof userId !== 'string'
    ) {
      throw new Error(NOTIFICATION_ERRORS.MISSING_PARAMS);
    }

    try {
      const notif = await NotificationModel.markAllAsRead(userId);
      return notif;
    } catch (err) {
      this.logger.logError(err);
      throw new Error(NOTIFICATION_ERRORS.SERVER_ERROR);
    }
  }

  public async markViewed(userId: string): Promise<[number]> {
    if (
      !userId
      && typeof userId !== 'string'
    ) {
      throw new Error(NOTIFICATION_ERRORS.MISSING_USER_ID);
    }

    try {
      return NotificationModel.markAsViewed(userId);
    } catch (err) {
      this.logger.logError(err);
      throw new Error(NOTIFICATION_ERRORS.SERVER_ERROR);
    }
  }

  public async markAsRead(id: string): Promise<[number]> {
    if (
      !id
      && typeof id !== 'string'
    ) {
      throw new Error(NOTIFICATION_ERRORS.MISSING_PARAMS);
    }

    try {
      return NotificationModel.markAsRead(id);
    } catch (err) {
      this.logger.logError(err);
      throw new Error(NOTIFICATION_ERRORS.SERVER_ERROR);
    }
  }

  public async markAllDismissed(userId: string): Promise<[number]> {
    if (
      !userId
      && typeof userId !== 'string'
    ) {
      throw new Error(NOTIFICATION_ERRORS.MISSING_PARAMS);
    }

    try {
      const notif = await NotificationModel.markAllDismissed(userId);
      return notif;
    } catch (err) {
      this.logger.logError(err);
      throw new Error(NOTIFICATION_ERRORS.SERVER_ERROR);
    }
  }

  public async markAsDismissed(id: string): Promise<[number]> {
    if (
      !id
      && typeof id !== 'string'
    ) {
      throw new Error(NOTIFICATION_ERRORS.MISSING_PARAMS);
    }

    try {
      return NotificationModel.markAsDismissed(id);
    } catch (err) {
      this.logger.logError(err);
      throw new Error(NOTIFICATION_ERRORS.SERVER_ERROR);
    }
  }

  public async testSockets(userId: string): Promise<void> {
    const baseNotification: NotificationType = {
      createdAt: new Date(),
      id: '',
      level: NOTIFICATION_LEVELS.INFO,
      message: 'message',
      title: 'test',
      userId,
      viewed: false
    };

    for (let i = 0, max = 10; i < max; i += 1) {
      NotificationSocketApiService.instance.sendNotification({
        ...baseNotification,
        id: `${i + 1}`,
        title: `Test: ${i + 1}`,
        message: `This is a test message for ${i + 1} notification`
      });
      await sleep(500);
    }
  }
}

export type NotificationServiceType = typeof NotificationService.prototype;
