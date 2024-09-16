import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

import { NotificationType } from '@dx/notifications-shared';
import { NotificationStateType } from './notification-web.types';
import { NOTIFICATION_WEB_ENTITY_NAME } from './notification-web.consts';

export const notificationInitialState: NotificationStateType = {
  system: [],
  user: []
};

const notificationsSlice = createSlice({
  name: NOTIFICATION_WEB_ENTITY_NAME,
  initialState: notificationInitialState,
  reducers: {
    setSystemNotifications(state, action: PayloadAction<NotificationType[]>) {
      state.system = action.payload;
    },
    setUserNotifications(state, action: PayloadAction<NotificationType[]>) {
      state.user = action.payload;
    },
    addSystemNotification(state, action: PayloadAction<NotificationType>) {
      const nextNotifications = state.system;
      nextNotifications.push(action.payload);
      state.system = nextNotifications;
    },
    addUserNotification(state, action: PayloadAction<NotificationType>) {
      const nextNotifications = state.user;
      nextNotifications.push(action.payload);
      state.user = nextNotifications;
    },
    removeNotification(state, action: PayloadAction<string>) {
      const nextSystemNotifications = state.system.filter(notification => notification.id !== action.payload);
      const nextUserNotifications = state.user.filter(notification => notification.id !== action.payload);
      state.system = nextSystemNotifications;
      state.user = nextUserNotifications;
    }
  },
});

export const notificationActions = notificationsSlice.actions;

export const notificationReducer = notificationsSlice.reducer;
