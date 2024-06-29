import { Router } from 'express';
import { AuthController } from './auth.controller';

export class AuthRoutes {
  static configure() {
    const router = Router();

    router.get('/lookup', AuthController.authLookup);
    router.get('/validate/email/:token', AuthController.validateEmail);

    router.post('/account', AuthController.createAccount);
    router.post('/login', AuthController.login);
    router.post('/logout', AuthController.logout);
    router.post('/otp-lockout', AuthController.lockoutFromOtpEmail);
    router.post('/refresh-token', AuthController.refreshTokens);
    router.post('/request-reset', AuthController.requestReset);
    router.post('/otp-code/send', AuthController.sendOtpToPhone);

    router.put('/setup-password', AuthController.setupPasswords);

    return router;
  }
}

export type AuthRoutesType = typeof AuthRoutes.prototype;
