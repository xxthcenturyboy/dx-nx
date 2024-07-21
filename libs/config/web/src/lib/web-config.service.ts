import { propertiesToArray } from "@dx/utils-shared-misc";
import { RouteState } from "@dx/ui-web";
import { AUTH_ROUTES } from '@dx/auth-web';
import { DASHBOARD_ROUTES } from '@dx/dashboard-web';
import {
  USER_PROFILE_ROUTES,
  USER_ROUTES
} from '@dx/user-web';
import { SHORTLINK_ROUTES } from '@dx/shortlink-web';

export class WebConfigService {
  public static getWebRoutes() {
    return {
      MAIN: '/',
      AUTH: AUTH_ROUTES,
      DASHBOARD: DASHBOARD_ROUTES,
      SHORTLINK: SHORTLINK_ROUTES,
      USER_PROFILE: USER_PROFILE_ROUTES,
      ADMIN: {
        USER: USER_ROUTES
      },
      SUDO: {
      }
    };
  }

  public static getRouteConfigs() {
    const routeState: RouteState = {};
    const mainRouteKeys: string[] = [];
    const routes = WebConfigService.getWebRoutes();

    if (routes) {
      const routeJson = propertiesToArray(routes);
      if (Array.isArray(routeJson)) {
        for (const routeKey of routeJson) {
          routeState[routeKey] = routeKey.split('.').reduce((a, b) => a[b], routes) || '';
          if (routeKey.includes('main')) {
            mainRouteKeys.push(routeKey);
          }
        }
      }
    }

    return {
      mainRouteKeys,
      routeState
    }
  }
};
