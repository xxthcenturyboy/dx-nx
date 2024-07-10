import { Router } from 'express';

import { DevicesController } from './devices.controller';
import { ensureLoggedIn } from '@dx/auth-api';
import { DxRateLimiters } from '@dx/utils-api-rate-limiters';

export class DevicesRoutes {
  static configure() {
    const router = Router();

    router.all('/*', [ensureLoggedIn]);

    router.put(
      '/biometric/public-key',
      DxRateLimiters.veryStrict(),
      DevicesController.updatePublicKey
    );
    router.put(
      '/fcm-token',
      DxRateLimiters.strict(),
      DevicesController.updateFcmToken
    );
    router.delete('/disconnect/:id', DevicesController.disconnectDevice);

    return router;
  }
}

export type DevicesRoutesType = typeof DevicesRoutes.prototype;
