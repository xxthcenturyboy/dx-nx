import { createBrowserRouter } from 'react-router-dom';

import { NotFoundComponent } from '@dx/ui-web';
import { WebConfigService } from '@dx/config-web';
import { HomeComponent } from '@dx/home';
import { ShortlinkComponent } from '@dx/shortlink-web';
import { AuthWebRouterConfig } from '@dx/auth-web';

export class AppRouter {
  public static getRouter() {
    const ROUTES = WebConfigService.getWebRoutes();

    return createBrowserRouter([
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
        element: (<NotFoundComponent routingFn={() => history.back()} />),
        errorElement: (<NotFoundComponent />)
      },
      {
        path: '*',
        element: (<NotFoundComponent routingFn={() => history.back()} />),
        errorElement: (<NotFoundComponent />)
      }
    ]);
  }
}
