import {
  createBrowserRouter,
  // unstable_BlockerFunction
} from 'react-router-dom';

import { NotFoundComponent } from '@dx/ui-web';
import { WebConfigService } from '@dx/config-web';
import { Root } from './root.component';
// import { HomeComponent } from '@dx/home';
// import { ShortlinkComponent } from '@dx/shortlink-web';
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
            lazy: async () => { let { HomeComponent } = await import('@dx/home')
              return { Component: HomeComponent }
            },
            // element: (<HomeComponent />),
            errorElement: (<NotFoundComponent />)
          },
          ...AuthWebRouterConfig.getRouter(),
          {
            path: `${ROUTES.SHORTLINK.MAIN}/:token`,
            lazy: async () => { let { ShortlinkComponent } = await import('@dx/shortlink-web')
              return { Component: ShortlinkComponent }
            },
            // element: (<ShortlinkComponent />),
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
