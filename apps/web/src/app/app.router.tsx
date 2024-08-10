import { createBrowserRouter } from 'react-router-dom';

import {
  GlobalErrorComponent,
  NotFoundComponent
} from '@dx/ui-web';
import { WebConfigService } from '@dx/config-web';
import { Root } from './root.component';
import { AuthWebRouterConfig } from '@dx/auth-web';
import { PrivateWebRouterConfig } from './private.router';

export class AppRouter {
  public static getRouter() {
    const ROUTES = WebConfigService.getWebRoutes();

    return createBrowserRouter([
      {
        element: (<Root />),
        errorElement: (<GlobalErrorComponent />),
        children: [
          {
            path: ROUTES.MAIN,
            lazy: async () => { let { HomeComponent } = await import('@dx/home')
              return { Component: HomeComponent }
            },
            errorElement: (<GlobalErrorComponent />)
          },
          ...AuthWebRouterConfig.getRouter(),
          {
            path: `${ROUTES.SHORTLINK.MAIN}/:token`,
            lazy: async () => { let { ShortlinkComponent } = await import('@dx/shortlink-web')
              return { Component: ShortlinkComponent }
            },
            errorElement: (<GlobalErrorComponent />)
          },
          ...PrivateWebRouterConfig.getRouter(),
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
