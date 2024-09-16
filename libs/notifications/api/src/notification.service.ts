import { NIL as NIL_UUID } from 'uuid';

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
// import admin from 'firebase-admin';

export class NotificationService {
  logger: ApiLoggingClassType;
  systemId: string;

  constructor() {
    this.logger = ApiLoggingClass.instance;
    this.systemId = NIL_UUID;
  }

  public async getNotificationsByUserId(userId: string): Promise<{ system: NotificationModel[], user: NotificationModel[] }> {
    if (
      !userId
      && typeof userId !== 'string'
    ) {
      throw new Error(NOTIFICATION_ERRORS.MISSING_USER_ID);
    }

    try {
      const userNotifications = await NotificationModel.getByUserId(userId);
      const systemNotifications = await NotificationModel.getSystemNotifications();
      return {
        system: systemNotifications,
        user: userNotifications
      };
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
      const notificationsCount = notifications.system.length + notifications.user.length;

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

      NotificationSocketApiService.instance.sendNotificationToUser(notification);

      if (!suppressPush) {
        this.sendDeviceNotification(userId, message, title, route);
      }
      return notification;
    } catch (err) {
      this.logger.logError(err);
      throw new Error(NOTIFICATION_ERRORS.SERVER_ERROR);
    }
  }

  public async createAndSendToAll(
    message: string,
    level: string,
    title?: string,
    route?: string,
    suppressPush?: boolean
  ): Promise<NotificationModel> {
    try {
      if (!message) {
        throw new Error(NOTIFICATION_ERRORS.MISSING_PARAMS);
      }

      const notification = await NotificationModel.createNew({
        userId: this.systemId,
        route,
        title,
        message,
        level
      });

      NotificationSocketApiService.instance.sendNotificationToAll(notification);

      if (!suppressPush) {
        this.sendDeviceNotification(this.systemId, message, title, route);
      }
      return notification;
    } catch (err) {
      this.logger.logError(err);
      throw new Error(NOTIFICATION_ERRORS.SERVER_ERROR);
    }
  }

  public async createAndSendAppUpdate(): Promise<void> {
    try {
      NotificationSocketApiService.instance.sendAppUpdateNotification('The applicaiton has been updated. Refresh your browser to get the latest update.');
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
    for (const level of Object.keys(NOTIFICATION_LEVELS)) {
      await this.createAndSend(
        userId,
        `Test Message for: ${level}`,
        level,
        `${level} Notificaion`
      );
      await sleep(1000);
    }

    NotificationSocketApiService.instance.sendAppUpdateNotification('The applicaiton has been updated. Refresh your browser to get the latest update.');
  }
}

export type NotificationServiceType = typeof NotificationService.prototype;
