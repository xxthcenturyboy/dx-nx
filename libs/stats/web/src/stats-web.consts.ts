import {
  AppMenuType,
  IconNames
} from '@dx/ui-web';

export const STATS_SUDO_WEB_ENTITY_NAME = 'stats';

export const STATS_SUDO_ROUTES = {
  HEALTH: `/sudo/stats/api-health`,
  USERS: '/sudo/stats/users'
};

export const STATS_SUDO_WEB_MENU: AppMenuType = {
  id: 'menu-stats',
  collapsible: true,
  description: 'Insights into the application.',
  title: 'App Stats',
  items: [
    {
      id: 'menu-item-stats-healthz',
      icon: IconNames.HEALTHZ,
      restriction: 'SUPER_ADMIN',
      routeKey: STATS_SUDO_ROUTES.HEALTH,
      title: 'API Health',
      type: 'ROUTE',
    },
    {
      beta: true,
      id: 'menu-item-stats-users',
      icon: IconNames.PEOPLE_OUTLINE,
      restriction: 'SUPER_ADMIN',
      routeKey: STATS_SUDO_ROUTES.USERS,
      title: 'User Stats',
      type: 'ROUTE',
    },
  ],
};
