import { createSelector } from 'reselect';

import { RootState } from '@dx/store-web';
import { NotificationType } from '@dx/notifications-shared';

const getNotifications = (state: RootState): NotificationType[] => state.notification.notifications;

export const selectNotificationCount = createSelector(
  [getNotifications],
  notifications => notifications.length
);
