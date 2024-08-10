import {
  Outlet,
  RouteObject
} from 'react-router-dom';

import {
  GlobalErrorComponent,
  NotFoundComponent,
  UnauthorizedComponent
} from '@dx/ui-web';
import { WebConfigService } from '@dx/config-web';
import { store } from '@dx/store-web';

export const AdminRouter = () => {
  const hasAdminRole = store.getState().userProfile.a || false;
  return (
    <>
      {
        hasAdminRole
          ? <Outlet />
          : <UnauthorizedComponent />
      }
    </>
  );
};

export class AdminWebRouterConfig {
  public static getRouter() {
    const ROUTES = WebConfigService.getWebRoutes();

    const config: RouteObject[] = [
      {
        element: (<AdminRouter />),
        errorElement: (<UnauthorizedComponent />),
        children: [
          {
            path: ROUTES.ADMIN.USER.LIST,
            // lazy: async () => { let { Dashboard } = await import('@dx/dashboard-web')
            //   return { Component: Dashboard }
            // },
            element: (<UnauthorizedComponent />),
            errorElement: (<GlobalErrorComponent />)
          }
        ]
      }
    ];

    return config;
  }
}
