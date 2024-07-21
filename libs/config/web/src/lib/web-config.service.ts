import { propertiesToArray } from "@dx/utils-shared-misc";
import { WEB_ROUTES } from './web-config.consts';
import {
  RouteState
} from "@dx/ui-web";

export class WebConfigService {
  public static getRouteConfigs() {
    const routeJson = propertiesToArray(WEB_ROUTES);
    const routeState: RouteState = {};
    const mainRouteKeys: string[] = [];

    for (const routeKey of routeJson) {
      routeState[routeKey] = routeKey.split('.').reduce((a, b) => a[b], WEB_ROUTES) || '';
      if (routeKey.includes('main')) {
        mainRouteKeys.push(routeKey);
      }
    }

    return {
      mainRouteKeys,
      routeState
    }
  }
};
