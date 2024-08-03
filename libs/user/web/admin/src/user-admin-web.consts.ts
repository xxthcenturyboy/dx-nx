import { AppMenuType } from '@dx/ui-web';

export const USER_ADMIN_ENTITY_NAME = 'userAdmin';

export const USER_ADMIN_ROUTES = {
  MAIN: `/admin/user`,
  LIST: `/admin/user/list`,
  EDIT: `/admin/user/edit`,
};

export const USER_ADMIN_MENU: AppMenuType = {
  id: 'menu-user',
  collapsible: true,
  description: 'Manage Users',
  title: 'Users',
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
      title: 'Create User',
      type: 'ROUTE',
    },
    {
      beta: true,
      id: 'menu-item-user-edit-beta',
      icon: '',
      restriction: 'ADMIN',
      routeKey: USER_ADMIN_ROUTES.EDIT,
      title: 'User Beta',
      type: 'ROUTE',
    },
  ],
};
