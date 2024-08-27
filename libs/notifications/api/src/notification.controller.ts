import {
  Request,
  Response
} from 'express';

import { sendBadRequest, sendOK } from '@dx/utils-api-http-response';
import { NotificationService } from './notification.service';
import { NOTIFICATION_LEVELS } from '@dx/notifications-shared';

export const NotificationController = {
  createNotification: async function (req: Request, res: Response) {
    try {
      const service = new NotificationService();
      const {
        level,
        message,
        route,
        suppressPush,
        title
      } = req.body as {
        level: keyof typeof NOTIFICATION_LEVELS;
        message: string;
        route?: string;
        suppressPush?: boolean;
        title?: string;
      }
      const result = await service.createAndSend(
        req.user.id,
        message,
        level,
        title,
        route,
        suppressPush || false
      );
      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },
  getAppBadgeCount: async function (req: Request, res: Response) {
    try {
      const service = new NotificationService();
      const { userId } = req.params as { userId: string };
      const result = await service.getAppBadgeCount(userId);
      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },
  getByUserId: async function (req: Request, res: Response) {
    try {
      const service = new NotificationService();
      const { userId } = req.params as { userId: string };
      const result = await service.getNotificationsByUserId(userId);
      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },
  markAllAsRead: async function (req: Request, res: Response) {
    try {
      const service = new NotificationService();
      const { userId } = req.params as { userId: string };
      const result = await service.markAllAsRead(userId);
      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },
  markAllAsViewed: async function (req: Request, res: Response) {
    try {
      const service = new NotificationService();
      const { userId } = req.params as { userId: string };
      const result = await service.markViewed(userId);
      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },
  markAllDismissed: async function (req: Request, res: Response) {
    try {
      const service = new NotificationService();
      const { userId } = req.params as { userId: string };
      const result = await service.markAllDismissed(userId);
      sendOK(req, res, { success: true });
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },
  markAsDismissed: async function (req: Request, res: Response) {
    try {
      const service = new NotificationService();
      const { id } = req.params as { id: string };
      const result = await service.markAsDismissed(id);
      sendOK(req, res, { success: true });
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },
  markAsRead: async function (req: Request, res: Response) {
    try {
      const service = new NotificationService();
      const { id } = req.params as { id: string };
      const result = await service.markAsRead(id);
      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },
  testSocket: async function (req: Request, res: Response) {
    try {
      const service = new NotificationService();
      const { userId } = req.params as { userId: string };
      await service.testSockets(userId);
      sendOK(req, res, 'OK');
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  }
};

export type NotificationControllerType = typeof NotificationController;
