import { Router } from 'express';
import { ensureLoggedIn, hasSuperAdminRole } from '@dx/auth-api';
import { PrivilegeSetController } from './user-privilege.controller';

export class UserPrivilegeRoutes {
  static configure() {
    const router = Router();

    router.all('/*', [ensureLoggedIn]);

    router.get('/', PrivilegeSetController.getAllPrivilegeSets);

    router.put(
      '/:id',
      [hasSuperAdminRole],
      PrivilegeSetController.updatePrivilegeSet
    );

    return router;
  }
}

export type UserPrivilegeRoutesType = typeof UserPrivilegeRoutes.prototype;
