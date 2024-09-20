import { IconNames } from '@dx/ui-web-system';
import { AppMenuType } from '@dx/ui-web-menus';

export const USER_ADMIN_ENTITY_NAME = 'userAdmin';

export const USER_ADMIN_ROUTES = {
  MAIN: `/admin/user`,
  LIST: `/admin/user/list`,
  DETAIL: `/admin/user/detail`,
};

export const USER_ADMIN_MENU: AppMenuType = {
  id: 'menu-user',
  collapsible: false,
  description: '',
  title: 'User Admin',
  items: [
    {
      id: 'menu-user-main',
      title: 'User Admin',
      icon: IconNames.PEOPLE,
      restriction: 'ADMIN',
      routeKey: USER_ADMIN_ROUTES.MAIN,
      type: 'ROUTE',
    },
  ],
};
