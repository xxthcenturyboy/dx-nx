import { AppMenuType } from '@dx/ui-web';

export const USER_ENTITY_NAME = 'user';
export const USER_PROFILE_ENTITY_NAME = 'user';

export const USER_ROUTES = {
  MAIN: `/admin/${USER_ENTITY_NAME}`,
  LIST: `/admin/${USER_ENTITY_NAME}/list`,
  EDIT: `/admin/${USER_ENTITY_NAME}/edit`,
};

export const USER_PROFILE_ROUTES = {
  MAIN: `/${USER_PROFILE_ENTITY_NAME}`
};

export const USER_MENU: AppMenuType = {
  id: 'menu-user',
  collapsible: true,
  description: 'Manage Users',
  title: 'Users',
  items: [
    {
      id: 'menu-item-header-user',
      icon: '',
      restriction: 'ADMIN',
      routeKey: USER_ROUTES.MAIN,
      title: 'Users',
      type: 'SUB_HEADING'
    },
    {
      id: 'menu-item-user-list',
      icon: '',
      restriction: 'ADMIN',
      routeKey: USER_ROUTES.LIST,
      title: 'User List',
      type: 'ROUTE'
    },
    {
      id: 'menu-item-user-edit',
      icon: '',
      restriction: 'ADMIN',
      routeKey: USER_ROUTES.EDIT,
      title: 'User Edit',
      type: 'ROUTE'
    }
  ]
};

export const USER_PROFILE_MENU: AppMenuType = {
  id: 'menu-user-profile',
  collapsible: false,
  description: '',
  title: 'Profile',
  items: [
    {
      id: 'menu-item-user-profile',
      icon: '',
      routeKey: USER_PROFILE_ROUTES.MAIN,
      title: 'User Profile',
      type: 'ROUTE'
    }
  ]
};
