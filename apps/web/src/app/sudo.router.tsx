import {
  Outlet,
  RouteObject
} from 'react-router-dom';

import {
  BetaFeatureComponent,
  GlobalErrorComponent,
  // NotFoundComponent,
  UnauthorizedComponent
} from '@dx/ui-web';
import { WebConfigService } from '@dx/config-web';
import { store } from '@dx/store-web';

export const SudoRouter = () => {
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

export class SudoWebRouterConfig {
  public static getRouter() {
    const ROUTES = WebConfigService.getWebRoutes();

    const config: RouteObject[] = [
      {
        element: (<SudoRouter />),
        errorElement: (<UnauthorizedComponent />),
        children: [
          {
            path: ROUTES.SUDO.STATS.HEALTH,
            lazy: async () => { let { StatsWebApiHealthComponent } = await import('@dx/stats-web')
              return { Component: StatsWebApiHealthComponent }
            },
          },
          {
            path: ROUTES.SUDO.STATS.USERS,
            // lazy: async () => { let { Dashboard } = await import('@dx/dashboard-web')
            //   return { Component: Dashboard }
            // },
            element: (<BetaFeatureComponent />),
            errorElement: (<GlobalErrorComponent />)
          }
        ]
      }
    ];

    return config;
  }
}
