import { store } from "@dx/store-web";
import { uiActions } from "@dx/ui-web";
import { UserProfileStateType } from "@dx/user-shared";
import {
  fetchNotifications,
  notificationActions,
  NotificationWebSockets
} from "@dx/notifications-web";
import { AppMenuType } from "@dx/ui-web";
import { logger } from "@dx/logger-web";

import { MenuConfigService } from "./menu-config.service";

function setUpMenus(
  userProfile: UserProfileStateType,
  mobileBreak: boolean
) {
  const menuService = new MenuConfigService();
  let menus: AppMenuType[] = [];
  if (userProfile.role.includes('SUPER_ADMIN')) {
    menus = menuService.getMenus('SUPER_ADMIN', userProfile.b);
  } else if (userProfile.role.includes('ADMIN')) {
    menus = menuService.getMenus('ADMIN', userProfile.b);
  } else {
    menus = menuService.getMenus(undefined, userProfile.b);
  }

  store.dispatch(uiActions.menusSet({ menus }));
  if (!mobileBreak) {
    store.dispatch(uiActions.toggleMenuSet(true));
  }
}

async function getNotifications(userId: string) {
  try {
    const fetchResult = (await store.dispatch(fetchNotifications.initiate({ userId }))).data;
    if (Array.isArray(fetchResult)) {
      store.dispatch(notificationActions.setNotifications(fetchResult));
    }
  } catch (err) {
    logger.error(`Error fetching notifications: ${err.message}`);
  }
}

function connectToSockets() {
  if (!NotificationWebSockets.instance) {
    new NotificationWebSockets();
  } else if (!NotificationWebSockets.instance.socket.connected) {
    NotificationWebSockets.instance.socket.connect();
  }
}

export function loginBootstrap(
  userProfile: UserProfileStateType,
  mobileBreak: boolean
) {
  setUpMenus(userProfile, mobileBreak);
  void getNotifications(userProfile?.id);
  connectToSockets();
}
