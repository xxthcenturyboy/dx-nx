import { AppMenuType, IconNames } from '@dx/ui-web-system';

export const USER_PROFILE_ENTITY_NAME = 'userProfile';

export const USER_PROFILE_ROUTES = {
  MAIN: `/profile`,
};

export const USER_PROFILE_MENU: AppMenuType = {
  id: 'menu-user-profile',
  collapsible: false,
  description: '',
  title: 'Profile Menu',
  items: [
    {
      id: 'menu-item-user-profile',
      icon: IconNames.ACCESSIBLITY,
      routeKey: USER_PROFILE_ROUTES.MAIN,
      title: 'Profile',
      type: 'ROUTE',
    },
  ],
};
