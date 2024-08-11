import { Express, Router } from 'express';

import { LivezRoutes } from '@dx/livez-api';
import { WellKnownRoutes } from '@dx/devices-api';
import { endpointNotFound } from '@dx/utils-api-http-response';
import { DxRateLimiters } from '@dx/utils-api-rate-limiters';
import { RoutesV1 } from './v1.routes';

export class ApiRoutes {
  app: Express;
  router: Router;

  constructor(app: Express) {
    this.app = app;
    this.router = Router();
  }

  public loadRoutes() {
    this.router.use(
      '/livez',
      DxRateLimiters.strict(),
      LivezRoutes.configure()
    );
    this.router.use(
      '/.well-known',
      DxRateLimiters.veryStrict(),
      WellKnownRoutes.configure()
    );
    this.router.use('/v1', RoutesV1.configure());

    this.router.all('/*', endpointNotFound);

    if (this.app) {
      this.app.use('/api', DxRateLimiters.standard(), this.router);
    }
  }
}
