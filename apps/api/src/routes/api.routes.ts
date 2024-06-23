import {
  Express,
  Router
} from 'express';

import {
  HealthzRoutes,
  HealthzRoutesType
} from '@dx/healthz';
import { RoutesV1 } from './v1.routes';
import { endpointNotFound } from '@dx/server';

export class ApiRoutes {
  app: Express;
  router: Router;

  constructor(app: Express) {
    this.app = app;
    this.router = Router();
  }

  public loadRoutes() {
    this.router.use('/healthz', HealthzRoutes.configure());
    this.router.use('/v1', RoutesV1.configure());

    this.router.all('/*', endpointNotFound);

    if (this.app) {
      this.app.use('/api', this.router);
    }
  }
}
