import { IconNames } from '@dx/ui-web-global-components';
import { AppMenuType } from '@dx/ui-web-menus';

export const DASHBOARD_ENTITY_NAME = 'dashboard';

export const DASHBOARD_ROUTES = {
  MAIN: `/${DASHBOARD_ENTITY_NAME}`,
};

export const DASHBOARD_MENU: AppMenuType = {
  id: 'menu-dashboard',
  collapsible: false,
  description: '',
  title: 'Dashboard',
  items: [
    {
      id: 'menu-item-dashboard',
      icon: IconNames.DASHBOARD,
      routeKey: DASHBOARD_ROUTES.MAIN,
      title: 'Dashboard',
      type: 'ROUTE',
    },
  ],
};
