import {
  AppMenuType,
  MenuRestrictionType
} from '@dx/ui-web';
import { DASHBOARD_MENU } from '@dx/dashboard-web';
import { STATS_SUDO_WEB_MENU } from '@dx/stats-web';
import { USER_ADMIN_MENU } from '@dx/user-admin-web';
import { USER_PROFILE_MENU } from '@dx/user-profile-web';
import { AppMenuItemType } from 'libs/ui/web/src/components/menu/app-menu.types';
export class MenuConfigService {
  // Order to appear in sidebar menu
  CARDINAL_MENU_SET = [
    DASHBOARD_MENU,
    USER_PROFILE_MENU,
    USER_ADMIN_MENU,
    STATS_SUDO_WEB_MENU
  ];

  private restrictSuperAdmin(
    menu: AppMenuType,
    includeBeta: boolean
  ) {
    const items: AppMenuItemType[] = [];

    for (const item of menu.items) {
      if (includeBeta) {
        if (!item.restriction) {
          items.push(item);
          continue;
        }

        if (
          item.restriction
          && (
            item.restriction === 'ADMIN'
            || item.restriction === 'SUPER_ADMIN'
          )
        ) {
          items.push(item);
          continue;
        }
      }

      if (!includeBeta) {
        if (
          !item.restriction
          && !item.beta
        ) {
          items.push(item);
          continue;
        }

        if (
          item.restriction
          && (
            item.restriction === 'ADMIN'
            || item.restriction === 'SUPER_ADMIN'
          )
          && !item.beta
        ) {
          items.push(item);
          continue;
        }
      }
    }

    if (items.length) {
      return {
        ...menu,
        items: items
      };
    }

    return null;
  }

  private restrictAdmin(
    menu: AppMenuType,
    includeBeta: boolean
  ) {
    const items: AppMenuItemType[] = [];

    for (const item of menu.items) {
      if (includeBeta) {
        if (!item.restriction) {
          items.push(item);
          continue;
        }

        if (
          item.restriction
          && item.restriction === 'ADMIN'
        ) {
          items.push(item);
          continue;
        }
      }

      if (!includeBeta) {
        if (
          !item.restriction
          && !item.beta
        ) {
          items.push(item);
          continue;
        }

        if (
          item.restriction
          && item.restriction === 'ADMIN'
          && !item.beta
        ) {
          items.push(item);
          continue;
        }
      }
    }

    if (items.length) {
      return {
        ...menu,
        items: items
      };
    }

    return null;
  }

  private restrictStandard(
    menu: AppMenuType,
    includeBeta: boolean
  ) {
    const items: AppMenuItemType[] = [];

    for (const item of menu.items) {
      if (includeBeta) {
        if (!item.restriction) {
          items.push(item);
          continue;
        }

        if (
          item.restriction
          && item.restriction !== 'ADMIN'
          && item.restriction !== 'SUPER_ADMIN'
        ) {
          items.push(item);
          continue;
        }
      }

      if (!includeBeta) {
        if (
          !item.restriction
          && !item.beta
        ) {
          items.push(item);
          continue;
        }

        if (
          item.restriction
          && item.restriction !== 'ADMIN'
          && item.restriction !== 'SUPER_ADMIN'
          && !item.beta
        ) {
          items.push(item);
          continue;
        }
      }
    }

    if (items.length) {
      return {
        ...menu,
        items: items
      };
    }

    return null;
  }

  public getMenus(
    restriction?: MenuRestrictionType,
    includeBeta?: boolean
  ) {
    const menus: AppMenuType[] = [];

    if (restriction === 'SUPER_ADMIN') {
      for (const menu of this.CARDINAL_MENU_SET) {
        const menuItem = this.restrictSuperAdmin(menu, includeBeta || false);
        if (menuItem) {
          menus.push(menuItem);
        }
      }

      return menus;
    }

    if (restriction === 'ADMIN') {
      for (const menu of this.CARDINAL_MENU_SET) {
        const menuItem = this.restrictAdmin(menu, includeBeta || false);
        if (menuItem) {
          menus.push(menuItem);
        }
      }

      return menus;
    }

    for (const menu of this.CARDINAL_MENU_SET) {
      const menuItem = this.restrictStandard(menu, includeBeta || false);
      if (menuItem) {
        menus.push(menuItem);
      }
    }

    return menus;
  }
}
