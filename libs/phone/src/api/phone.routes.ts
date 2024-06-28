import { Router } from 'express';
import {
  ensureLoggedIn,
  hasSuperAdminRole
} from '@dx/auth';
import { PhoneController } from './phone.controller';

export class PhoneRoutes {
  static configure() {
    const router = Router();

    router.all('/*', [ensureLoggedIn]);

    router.post('/', PhoneController.createPhone);

    router.put('/:id', PhoneController.updatePhone);

    router.delete('/:id', PhoneController.deletePhone);
    router.delete('/test/:id', hasSuperAdminRole, PhoneController.deletePhoneTest);

    return router;
  }
}

export type PhoneRoutesType = typeof PhoneRoutes.prototype;
