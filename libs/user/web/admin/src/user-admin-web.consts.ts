import {
  AppMenuType,
  IconNames
} from '@dx/ui-web';

export const USER_ADMIN_ENTITY_NAME = 'userAdmin';

export const USER_ADMIN_ROUTES = {
  MAIN: `/admin/user`,
  LIST: `/admin/user/list`,
  EDIT: `/admin/user/edit`,
  BETA: '/admin/user/beta'
};

export const USER_ADMIN_MENU: AppMenuType = {
  id: 'menu-user',
  collapsible: true,
  description: 'Manage Users',
  title: 'User Admin',
  items: [
    // {
    //   id: 'menu-item-header-user',
    //   icon: '',
    //   restriction: 'ADMIN',
    //   routeKey: USER_ADMIN_ROUTES.MAIN,
    //   title: 'Manage Users',
    //   type: 'SUB_HEADING',
    // },
    {
      id: 'menu-item-user-list',
      icon: IconNames.PEOPLE,
      restriction: 'ADMIN',
      routeKey: USER_ADMIN_ROUTES.LIST,
      title: 'List',
      type: 'ROUTE',
    },
    {
      id: 'menu-item-user-edit',
      icon: IconNames.MANAGE_ACCOUNTS,
      restriction: 'ADMIN',
      routeKey: USER_ADMIN_ROUTES.EDIT,
      title: 'Edit',
      type: 'ROUTE',
    },
    {
      beta: true,
      id: 'menu-item-user-edit-beta',
      icon: IconNames.MENU_OPEN,
      restriction: 'ADMIN',
      routeKey: USER_ADMIN_ROUTES.BETA,
      title: 'Beta Feature',
      type: 'ROUTE',
    },
  ],
};
