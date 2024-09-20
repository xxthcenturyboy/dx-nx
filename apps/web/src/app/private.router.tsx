import { Navigate, Outlet, RouteObject } from 'react-router-dom';

import {
  GlobalErrorComponent,
  // NotFoundComponent,
  UnauthorizedComponent,
} from '@dx/ui-web-global-components';
import { WebConfigService } from '@dx/config-web';
import { store } from '@dx/store-web';
import { selectIsAuthenticated } from '@dx/auth-web';
import { AdminWebRouterConfig } from './admin.router';
import { SudoWebRouterConfig } from './sudo.router';

export const PrivateRouter = () => {
  const isAuthenticated = selectIsAuthenticated(store.getState());
  const ROUTES = WebConfigService.getWebRoutes();
  return (
    <>{isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.AUTH.LOGIN} />}</>
  );
};

export class PrivateWebRouterConfig {
  public static getRouter() {
    const ROUTES = WebConfigService.getWebRoutes();

    const config: RouteObject[] = [
      {
        element: <PrivateRouter />,
        errorElement: <UnauthorizedComponent />,
        children: [
          {
            path: ROUTES.DASHBOARD.MAIN,
            lazy: async () => {
              let { Dashboard } = await import('@dx/dashboard-web');
              return { Component: Dashboard };
            },
            errorElement: <GlobalErrorComponent />,
          },
          {
            path: ROUTES.USER_PROFILE.MAIN,
            lazy: async () => {
              let { UserProfile } = await import('@dx/user-profile-web');
              return { Component: UserProfile };
            },
            errorElement: <GlobalErrorComponent />,
          },
          ...AdminWebRouterConfig.getRouter(),
          ...SudoWebRouterConfig.getRouter(),
        ],
      },
    ];

    return config;
  }
}
