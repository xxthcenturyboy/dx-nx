import { Router } from 'express';

import {
  ensureLoggedIn,
  hasSuperAdminRole
} from '@dx/auth-api';
import { HealthzController } from './healthz.controller';

export class HealthzRoutes {
  static configure() {
    const router = Router();

    router.get(
      '/',
      [
        ensureLoggedIn,
        hasSuperAdminRole
      ],
      HealthzController.getHealth
    );

    return router.bind(router);
  }
}

export type HealthzRoutesType = typeof HealthzRoutes.prototype;
