import { Router } from 'express';

import { ensureLoggedIn, hasAdminRole, hasSuperAdminRole } from '@dx/auth-api';
import { UserController } from './user.controller';

export class UserRoutes {
  static configure() {
    const router = Router();

    router.all('/*', [ensureLoggedIn]);

    router.get('/list', hasAdminRole, UserController.getUsersList);
    router.get('/profile', UserController.getUserProfile);
    router.get('/user/:id', hasAdminRole, UserController.getUser);
    router.get('/check/availabilty', UserController.checkUsernameAvailability);

    router.post('/', hasSuperAdminRole, UserController.createUser);
    router.post('/send-otp-code', UserController.sendOtpCode);

    router.put('/:id', UserController.updateUser);
    router.put(
      '/roles-restrictions/:id',
      hasAdminRole,
      UserController.updateRolesRestrictions
    );
    // router.put('/resend/invite', hasAdminRole, UserController.resendInvite);
    router.put('/update/password', UserController.updatePassword);
    router.put('/update/username/:id', UserController.updateUserName);

    router.delete('/:id', hasAdminRole, UserController.deleteUser);
    router.delete(
      '/test/:id',
      hasSuperAdminRole,
      UserController.deleteUserTest
    );

    return router;
  }
}

export type UserRoutesType = typeof UserRoutes.prototype;
