import { Router } from 'express';
import { EmailController } from './email.controller';
import { ensureLoggedIn } from '@dx/auth';

export class EmailRoutes {
  static configure() {
    const router = Router();

    router.post('/validate-email', EmailController.validateEmail);

    router.all('/*', [ensureLoggedIn]);



    return router;
  }
}

export type EmailRoutesType = typeof EmailRoutes.prototype;
