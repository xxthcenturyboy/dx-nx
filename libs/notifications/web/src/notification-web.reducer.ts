import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

import { NotificationType } from '@dx/notifications-shared';
import { NotificationStateType } from './notification-web.types';
import { NOTIFICATION_WEB_ENTITY_NAME } from './notification-web.consts';

export const notificationInitialState: NotificationStateType = {
  notifications: []
};

const notificationsSlice = createSlice({
  name: NOTIFICATION_WEB_ENTITY_NAME,
  initialState: notificationInitialState,
  reducers: {
    setNotifications(state, action: PayloadAction<NotificationType[]>) {
      state.notifications = action.payload;
    },
    removeNotification(state, action: PayloadAction<string>) {
      const nextNotifications = state.notifications.filter(notification => notification.id !== action.payload);
      state.notifications = nextNotifications;
    }
  },
});

export const notificationActions = notificationsSlice.actions;

export const notificationReducer = notificationsSlice.reducer;
