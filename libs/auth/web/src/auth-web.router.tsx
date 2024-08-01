import {
  createBrowserRouter,
  Outlet,
  RouteObject
} from 'react-router-dom';

import {
  NotFoundComponent,
  UnauthorizedComponent
} from '@dx/ui-web';
import { WebConfigService } from '@dx/config-web';
import { WebLogin } from './auth-web-login.component';

export const AuthWebRouter = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export class AuthWebRouterConfig {
  public static getRouter() {
    const ROUTES = WebConfigService.getWebRoutes();

    const config: RouteObject[] = [
      {
        path: ROUTES.AUTH.LOGIN,
        element: (<WebLogin />),
        errorElement: (<NotFoundComponent />)
      },
      {
        path: ROUTES.AUTH.MAIN,
        element: (<AuthWebRouter />),
        errorElement: (<NotFoundComponent />),
        children: [
          // {
          //   path: ROUTES.AUTH.LOGIN,
          //   element: (<WebLogin />),
          //   errorElement: (<NotFoundComponent />)
          // }
        ]
      }
    ];

    return config;
  }
}
