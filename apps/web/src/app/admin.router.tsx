import {
  Outlet,
  RouteObject
} from 'react-router-dom';

import {
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
            path: ROUTES.ADMIN.USER.MAIN,
            lazy: async () => { let { UserAdminMain } = await import('@dx/user-admin-web')
              return { Component: UserAdminMain }
            }
          },
          {
            path: ROUTES.ADMIN.USER.LIST,
            lazy: async () => { let { UserAdminList } = await import('@dx/user-admin-web')
              return { Component: UserAdminList }
            }
          },
          {
            path: `${ROUTES.ADMIN.USER.DETAIL}/:id`,
            lazy: async () => { let { UserAdminEdit } = await import('@dx/user-admin-web')
              return { Component: UserAdminEdit }
            }
          }
        ]
      }
    ];

    return config;
  }
}
