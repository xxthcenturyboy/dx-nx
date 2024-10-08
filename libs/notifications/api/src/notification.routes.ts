import { Router } from 'express';

import {
  ensureLoggedIn,
  hasAdminRole,
  hasSuperAdminRole
} from '@dx/auth-api';
import { NotificationController } from './notification.controller';

export class NotificationRoutes {
  static configure() {
    const router = Router();

    router.all('/*', [ensureLoggedIn]);

    router.get(
      '/badge-count/:userId',
      NotificationController.getAppBadgeCount
    );
    router.get(
      '/user/:userId',
      NotificationController.getByUserId
    );

    router.post(
      '/user',
      hasAdminRole,
      NotificationController.createNotification
    );
    router.post(
      '/all-users',
      hasAdminRole,
      NotificationController.createNotificationToAll
    );
    router.post(
      '/app-update',
      hasSuperAdminRole,
      NotificationController.createAppNotification
    );
    router.post(
      '/test/:userId',
      NotificationController.testSocket
    );

    router.put(
      '/read-all/:userId',
      NotificationController.markAllAsRead
    );
    router.put(
      '/viewed-all/:userId',
      NotificationController.markAllAsViewed
    );
    router.put(
      '/dismiss-all/:userId',
      NotificationController.markAllDismissed
    );
    router.put(
      '/dismiss/:id/:userId',
      NotificationController.markAsDismissed
    );
    router.put(
      '/read/:id',
      NotificationController.markAsRead
    );

    return router;
  }
}

export type NotificationRoutesType = typeof NotificationRoutes.prototype;
