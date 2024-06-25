import { Router } from 'express';
import { EmailController } from './email.controller';

export class EmailRoutes {
  static configure() {
    const router = Router();

    router.get('/', EmailController.getData);

    return router;
  }
}

export type EmailRoutesType = typeof EmailRoutes.prototype;
