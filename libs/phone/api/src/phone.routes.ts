import { Router } from 'express';

import { ensureLoggedIn, hasAdminRole, hasSuperAdminRole } from '@dx/auth-api';
import { PhoneController } from './phone.controller';

export class PhoneRoutes {
  static configure() {
    const router = Router();

    router.all(
      '/*',
      [ensureLoggedIn]
    );

    router.post(
      '/validate',
      PhoneController.checkAvailability
    );
    router.post(
      '/',
      PhoneController.createPhone
    );

    router.put(
      '/:id',
      PhoneController.updatePhone
    );

    router.delete(
      '/user-profile/:id',
      PhoneController.deletePhoneUserProfile
    );
    router.delete(
      '/:id',
      hasAdminRole,
      PhoneController.deletePhone
    );
    router.delete(
      '/test/:id',
      hasSuperAdminRole,
      PhoneController.deletePhoneTest
    );

    return router;
  }
}

export type PhoneRoutesType = typeof PhoneRoutes.prototype;
