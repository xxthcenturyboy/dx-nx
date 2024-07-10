import { Router } from 'express';
import { ShortlinkController } from './shortlink.controller';

export class ShortlinkRoutes {
  static configure() {
    const router = Router();

    router.get('/', ShortlinkController.redirectToTarget);

    return router;
  }
}

export type ShortlinkRoutesType = typeof ShortlinkRoutes.prototype;
