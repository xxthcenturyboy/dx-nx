import { Router } from 'express';

import { LivesController } from './lives-api.controller';

export class LivezRoutes {
  static configure() {
    const router = Router();

    router.get('/', LivesController.getLives);

    return router.bind(router);
  }
}

export type LivezRoutesType = typeof LivezRoutes.prototype;
