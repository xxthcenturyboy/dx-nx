import {
  Navigate,
  Outlet,
  RouteObject
} from 'react-router-dom';

import {
  NotFoundComponent,
  UnauthorizedComponent
} from '@dx/ui-web';
import { WebConfigService } from '@dx/config-web';
import { store } from '@dx/store-web';
import { selectIsAuthenticated } from '@dx/auth-web';
import { AdminWebRouterConfig } from './admin.router';
import { SuperAdminWebRouterConfig } from './super-admin.router';

export const PrivateRouter = () => {
  const isAuthenticated = selectIsAuthenticated(store.getState());
  const ROUTES = WebConfigService.getWebRoutes();
  return (
    <>
      {
        isAuthenticated
          ? <Outlet />
          : <Navigate to={ROUTES.AUTH.LOGIN} />
      }
    </>
  );
};

export class PrivateWebRouterConfig {
  public static getRouter() {
    const ROUTES = WebConfigService.getWebRoutes();

    const config: RouteObject[] = [
      {
        element: (<PrivateRouter />),
        errorElement: (<UnauthorizedComponent />),
        children: [
          {
            path: ROUTES.DASHBOARD.MAIN,
            lazy: async () => { let { Dashboard } = await import('@dx/dashboard-web')
              return { Component: Dashboard }
            },
            errorElement: (<NotFoundComponent />)
          },
          ...AdminWebRouterConfig.getRouter(),
          ...SuperAdminWebRouterConfig.getRouter()
        ]
      }
    ];

    return config;
  }
}
