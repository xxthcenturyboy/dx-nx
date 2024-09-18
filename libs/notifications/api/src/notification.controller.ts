import {
  Request,
  Response
} from 'express';
import { NIL as NIL_UUID } from 'uuid';

import {
  sendBadRequest,
  sendOK
} from '@dx/utils-api-http-response';
import {
  // NOTIFICATION_LEVELS,
  NotificationCreationParamTypes
} from '@dx/notifications-shared';
import { userHasRole } from '@dx/auth-api';
import { NotificationService } from './notification.service';
import { USER_ROLE } from '@dx/user-privilege-shared';

export const NotificationController = {
  createNotification: async function (req: Request, res: Response) {
    try {
      const service = new NotificationService();
      const {
        level,
        message,
        route,
        suppressPush,
        title,
        userId
      } = req.body as NotificationCreationParamTypes;
      const result = await service.createAndSend(
        userId,
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

  createNotificationToAll: async function (req: Request, res: Response) {
    try {
      const service = new NotificationService();
      const {
        level,
        message,
        route,
        suppressPush,
        title
      } = req.body as Partial<NotificationCreationParamTypes>
      const result = await service.createAndSendToAll(
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

  createAppNotification: async function (req: Request, res: Response) {
    try {
      const service = new NotificationService();
      const result = await service.createAndSendAppUpdate();
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
      if (
        userId === NIL_UUID
        && userHasRole(req.user.id, USER_ROLE.SUPER_ADMIN)
      ) {
        await service.markAllDismissed(NIL_UUID);
      }
      if (
        userId !== NIL_UUID
      ) {
        await service.markAllDismissed(userId);
      }
      sendOK(req, res, { success: true });
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  markAsDismissed: async function (req: Request, res: Response) {
    try {
      const service = new NotificationService();
      const { id, userId } = req.params as { id: string, userId: string };
      if (
        (
          userId === NIL_UUID
          && userHasRole(req.user.id, USER_ROLE.SUPER_ADMIN)
        )
        || (
          userId !== NIL_UUID
        )
      ) {
        await service.markAsDismissed(id);
      }
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
