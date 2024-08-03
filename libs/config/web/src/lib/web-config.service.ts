import { propertiesToArray } from '@dx/utils-shared-misc';
import { RouteState } from '@dx/ui-web';
import { AUTH_ROUTES } from '@dx/auth-web';
import { DASHBOARD_ROUTES } from '@dx/dashboard-web';
import { USER_ADMIN_ROUTES } from '@dx/user-admin-web';
import { USER_PROFILE_ROUTES } from '@dx/user-profile-web';
import { SHORTLINK_ROUTES } from '@dx/shortlink-web';
import { WEB_APP_ENV } from '@dx/config-web';

export class WebConfigService {
  public static getWebUrls()  {
    return {
      API_URL: `${WEB_APP_ENV.API_URL}:${WEB_APP_ENV.API_PORT}`,
      WEB_APP_URL: `${WEB_APP_ENV.WEB_APP_URL}:${WEB_APP_ENV.WEB_APP_PORT}`
    };
  }

  public static getWebRoutes() {
    return {
      MAIN: '/',
      AUTH: AUTH_ROUTES,
      DASHBOARD: DASHBOARD_ROUTES,
      NOT_FOUND: '/404',
      SHORTLINK: SHORTLINK_ROUTES,
      USER_PROFILE: USER_PROFILE_ROUTES,
      ADMIN: {
        USER: USER_ADMIN_ROUTES,
      },
      SUDO: {},
    };
  }

  public static getNoRedirectRoutes() {
    const routes = WebConfigService.getWebRoutes();
    if (routes) {
      return [routes.MAIN, routes.AUTH.LOGIN, routes.SHORTLINK.MAIN];
    }

    return [];
  }

  public static getRouteConfigs() {
    const routeState: RouteState = {};
    const mainRouteKeys: string[] = [];
    const routes = WebConfigService.getWebRoutes();

    if (routes) {
      const routeJson = propertiesToArray(routes);
      if (Array.isArray(routeJson)) {
        for (const routeKey of routeJson) {
          routeState[routeKey] =
            routeKey.split('.').reduce((a, b) => a[b], routes) || '';
          if (routeKey.includes('MAIN')) {
            mainRouteKeys.push(routeKey);
          }
        }
      }
    }

    return {
      mainRouteKeys,
      routeState,
    };
  }
}
