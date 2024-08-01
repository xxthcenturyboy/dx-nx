import { createBrowserRouter, unstable_BlockerFunction } from 'react-router-dom';

import { NotFoundComponent } from '@dx/ui-web';
import { WebConfigService } from '@dx/config-web';
import { Root } from './root.component';
import { HomeComponent } from '@dx/home';
import { ShortlinkComponent } from '@dx/shortlink-web';
import { AuthWebRouterConfig } from '@dx/auth-web';

export class AppRouter {
  public static getRouter() {
    const ROUTES = WebConfigService.getWebRoutes();

    return createBrowserRouter([
      {
        element: (<Root />),
        errorElement: (<NotFoundComponent />),
        children: [
          {
            path: ROUTES.MAIN,
            element: (<HomeComponent />),
            errorElement: (<NotFoundComponent />)
          },
          ...AuthWebRouterConfig.getRouter(),
          {
            path: `${ROUTES.SHORTLINK.MAIN}/:token`,
            element: (<ShortlinkComponent />),
            errorElement: (<NotFoundComponent />)
          },
          {
            path: ROUTES.NOT_FOUND,
            element: (<NotFoundComponent />),
            errorElement: (<NotFoundComponent />)
          },
          {
            path: '*',
            element: (<NotFoundComponent />),
            errorElement: (<NotFoundComponent />)
          }
        ]
      },
    ]);
  }
}
