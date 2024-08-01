import {
  AppMenuType,
  MenuRestrictionType
} from '@dx/ui-web';
import { DASHBOARD_MENU } from '@dx/dashboard-web';
import { USER_ADMIN_MENU } from '@dx/user-admin-web';
import { USER_PROFILE_MENU } from '@dx/user-profile-web';
export class MenuConfigService {
  CARDINAL_MENU_SET = [
    DASHBOARD_MENU,
    USER_PROFILE_MENU,
    USER_ADMIN_MENU
  ];

  private restrictSuperAdmin(menu: AppMenuType) {
    const unrestrictedItems = menu.items.filter(
      (item) => item.restriction !== 'SUPERADMIN'
    );
    if (unrestrictedItems.length) {
      menu.items = unrestrictedItems;
      return menu;
    }

    return null;
  }

  private restrictBeta(menu: AppMenuType) {
    const unrestrictedItems = menu.items.filter(
      (item) =>
        item.restriction !== 'BETA' &&
        item.restriction !== 'ADMIN' &&
        item.restriction !== 'SUPERADMIN'
    );
    if (unrestrictedItems.length) {
      menu.items = unrestrictedItems;
      return menu;
    }

    return null;
  }

  private restrictStandard(menu: AppMenuType) {
    const unrestrictedItems = menu.items.filter(
      (item) =>
        item.restriction !== 'ADMIN' && item.restriction !== 'SUPERADMIN'
    );
    if (unrestrictedItems.length) {
      menu.items = unrestrictedItems;
      return menu;
    }

    return null;
  }

  public getMenus(restriction?: MenuRestrictionType) {
    if (restriction === 'SUPERADMIN') {
      return this.CARDINAL_MENU_SET;
    }

    const menus: AppMenuType[] = [];

    if (restriction === 'ADMIN') {
      for (const menu of this.CARDINAL_MENU_SET) {
        const menuItem = this.restrictSuperAdmin(menu);
        if (menuItem) {
          menus.push(menuItem);
        }
      }

      return menus;
    }

    if (restriction === 'BETA') {
      for (const menu of this.CARDINAL_MENU_SET) {
        const menuItem = this.restrictBeta(menu);
        if (menuItem) {
          menus.push(menuItem);
        }
      }

      return menus;
    }

    for (const menu of this.CARDINAL_MENU_SET) {
      const menuItem = this.restrictStandard(menu);
      if (menuItem) {
        menus.push(menuItem);
      }
    }

    return menus;
  }
}
