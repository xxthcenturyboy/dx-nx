import { Router } from 'express';
import { PhoneController } from './phone.controller';

export class PhoneRoutes {
  static configure() {
    const router = Router();

    router.get('/', PhoneController.getData);

    return router;
  }
}

export type PhoneRoutesType = typeof PhoneRoutes.prototype;
