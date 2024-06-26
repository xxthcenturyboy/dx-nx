import { Router } from 'express';
import { EmailController } from './email.controller';
import { ensureLoggedIn } from '@dx/auth';

export class EmailRoutes {
  static configure() {
    const router = Router();

    router.post('/validate-email', EmailController.validateEmail);

    router.all('/*', [ensureLoggedIn]);

    router.post('/', EmailController.createEmail);

    router.put('/:id', EmailController.updateEmail);

    router.delete('/:id', EmailController.deleteEmail);

    return router;
  }
}

export type EmailRoutesType = typeof EmailRoutes.prototype;
