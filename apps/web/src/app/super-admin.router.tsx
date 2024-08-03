import {
  Outlet,
  RouteObject
} from 'react-router-dom';

import {
  NotFoundComponent,
  UnauthorizedComponent
} from '@dx/ui-web';
import { WebConfigService } from '@dx/config-web';
import { store } from '@dx/store-web';

export const SuperAdminRouter = () => {
  const hasSuperAdminRole = store.getState().userProfile.sa || false;
  return (
    <>
      {
        hasSuperAdminRole
          ? <Outlet />
          : <UnauthorizedComponent />
      }
    </>
  );
};

export class SuperAdminWebRouterConfig {
  public static getRouter() {
    const ROUTES = WebConfigService.getWebRoutes();

    const config: RouteObject[] = [
      {
        element: (<SuperAdminRouter />),
        errorElement: (<UnauthorizedComponent />),
        children: [
        ]
      }
    ];

    return config;
  }
}
