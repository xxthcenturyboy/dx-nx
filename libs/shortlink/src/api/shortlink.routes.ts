import { Router } from 'express';
import { ShortlinkController } from './shortlink.controller';

export class ShortlinkRoutes {
  static configure() {
    const router = Router();

    router.get('/', ShortlinkController.getData);

    return router;
  }
}

export type ShortlinkRoutesType = typeof ShortlinkRoutes.prototype;
