import { Router } from 'express';
import { DevicesController } from './devices.controller';

export class DevicesRoutes {
  static configure() {
    const router = Router();

    router.get('/', DevicesController.getData);

    return router;
  }
}

export type DevicesRoutesType = typeof DevicesRoutes.prototype;
