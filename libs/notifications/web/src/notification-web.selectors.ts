import { createSelector } from 'reselect';

import type { RootState } from '@dx/store-web';
import { NotificationType } from '@dx/notifications-shared';

const getSystemNotifications = (state: RootState): NotificationType[] => state.notification.system;
const getUserNotifications = (state: RootState): NotificationType[] => state.notification.user;

export const selectSystemNotificationCount = createSelector(
  [getSystemNotifications],
  notifications => notifications.length
);

export const selectUserNotificationCount = createSelector(
  [getUserNotifications],
  notifications => notifications.length
);

export const selectNotificationCount = createSelector(
  [
    selectSystemNotificationCount,
    selectUserNotificationCount
  ],
  (systemCount, userCount) => systemCount + userCount
);
