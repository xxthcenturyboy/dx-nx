import { Router } from 'express';

import { UserController } from './user.controller';
import {
  ensureLoggedIn,
  hasAdminRole,
  hasSuperAdminRole
} from '@dx/auth';

export class UserRoutes {
  static configure() {
    const router = Router();

    router.all('/*', [ensureLoggedIn]);

    router.get('/list', hasAdminRole, UserController.getUsersList);
    router.get('/profile', UserController.getUserProfile);
    router.get('/user/:id', hasAdminRole, UserController.getUser);
    router.get('/check/availabilty', UserController.checkUsernameAvailability);
    router.get('/test/otp/:userId', hasSuperAdminRole, UserController.getOtpTest);

    router.post('/', hasAdminRole, UserController.createUser);
    router.post('/send-otp-code', UserController.sendOtpCode);

    router.put('/:id', hasAdminRole, UserController.updateUser);
    router.put('/resend/invite', hasAdminRole, UserController.resendInvite);
    router.put('/update/password', UserController.updatePassword);

    router.delete('/:id', hasAdminRole, UserController.deleteUser);
    router.delete('/test/:id', hasSuperAdminRole, UserController.deleteUserTest);

    return router;
  }
}

export type UserRoutesType = typeof UserRoutes.prototype;
