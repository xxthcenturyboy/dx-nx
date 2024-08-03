import { AppMenuType } from '@dx/ui-web';

export const USER_ADMIN_ENTITY_NAME = 'userAdmin';

export const USER_ADMIN_ROUTES = {
  MAIN: `/admin/${USER_ADMIN_ENTITY_NAME}`,
  LIST: `/admin/${USER_ADMIN_ENTITY_NAME}/list`,
  EDIT: `/admin/${USER_ADMIN_ENTITY_NAME}/edit`,
};

export const USER_ADMIN_MENU: AppMenuType = {
  id: 'menu-user',
  collapsible: true,
  description: 'Manage Users',
  title: 'Users',
  items: [
    {
      id: 'menu-item-header-user',
      icon: '',
      restriction: 'ADMIN',
      routeKey: USER_ADMIN_ROUTES.MAIN,
      title: 'Users',
      type: 'SUB_HEADING',
    },
    {
      id: 'menu-item-user-list',
      icon: '',
      restriction: 'ADMIN',
      routeKey: USER_ADMIN_ROUTES.LIST,
      title: 'User List',
      type: 'ROUTE',
    },
    {
      id: 'menu-item-user-edit',
      icon: '',
      restriction: 'ADMIN',
      routeKey: USER_ADMIN_ROUTES.EDIT,
      title: 'User Edit',
      type: 'ROUTE',
    },
    {
      beta: true,
      id: 'menu-item-user-edit-beta',
      icon: '',
      restriction: 'ADMIN',
      routeKey: USER_ADMIN_ROUTES.EDIT,
      title: 'User Edit',
      type: 'ROUTE',
    },
  ],
};
