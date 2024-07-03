import { Router } from 'express';

import { DevicesController } from './devices.controller';
import {
  ensureLoggedIn
} from '@dx/auth';

export class DevicesRoutes {
  static configure() {
    const router = Router();

    router.all('/*', [ensureLoggedIn]);

    router.put('/', DevicesController.updateDevice);
    router.delete('/disconnect/:id', DevicesController.disconnectDevice);

    return router;
  }
}

export type DevicesRoutesType = typeof DevicesRoutes.prototype;
