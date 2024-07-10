import { Router } from 'express';

import { HealthzController } from './healthz.controller';

export class HealthzRoutes {
  static configure() {
    const router = Router();

    router.get('/', HealthzController.getHealth);

    return router.bind(router);
  }
}

export type HealthzRoutesType = typeof HealthzRoutes.prototype;
