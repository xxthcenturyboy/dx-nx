import { Router } from 'express';
import { EmailController } from './email.controller';
import { ensureLoggedIn, hasAdminRole, hasSuperAdminRole } from '@dx/auth-api';

export class EmailRoutes {
  static configure() {
    const router = Router();

    router.post('/test/validate-email', EmailController.validateTestEmail);

    router.all('/*', [ensureLoggedIn]);

    router.post('/', EmailController.createEmail);

    router.put('/:id', EmailController.updateEmail);

    router.delete('/:id', hasAdminRole, EmailController.deleteEmail);
    router.delete(
      '/test/:id',
      hasSuperAdminRole,
      EmailController.deleteEmailTest
    );

    return router;
  }
}

export type EmailRoutesType = typeof EmailRoutes.prototype;
