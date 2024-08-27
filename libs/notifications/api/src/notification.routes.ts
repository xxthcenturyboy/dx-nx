import { Router } from 'express';

import { ensureLoggedIn } from '@dx/auth-api';
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
      '/',
      NotificationController.createNotification
    );
    router.post(
      '/:userId',
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
      '/dismiss/:id',
      NotificationController.markAsDismissed
    );
    router.put(
      '/dismiss-all/:userId',
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
