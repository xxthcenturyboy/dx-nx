import { Express } from 'express';

import {
  HealthzRoutes,
  HealthzRoutesType
} from '@dx/healthz';
import {
  UserRoutes,
  UserRoutesType
} from '@dx/user';

export class RoutesV1 {
  app: Express;
  healthzRoutes: HealthzRoutesType;
  userRoutes: UserRoutesType;

  constructor(app: Express) {
    this.app = app;
    this.healthzRoutes = new HealthzRoutes();
    this.userRoutes = new UserRoutes();
  }

  public loadRoutes() {
    if (this.app) {
      this.app.use('/', HealthzRoutes.configure());
      this.app.use('/v1', this.healthzRoutes.getRoutes());
      this.app.use('/v1', this.userRoutes.getRoutes());
    }
  }
}
