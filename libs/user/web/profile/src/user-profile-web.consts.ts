import { AppMenuType } from '@dx/ui-web';

export const USER_PROFILE_ENTITY_NAME = 'userProfile';

export const USER_PROFILE_ROUTES = {
  MAIN: `/${USER_PROFILE_ENTITY_NAME}`,
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
      type: 'ROUTE',
    },
  ],
};
