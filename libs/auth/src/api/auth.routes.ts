import { Router } from 'express';
import { AuthController } from './auth.controller';

export class AuthRoutes {
  static configure() {
    const router = Router();

    router.get('/lookup', AuthController.userLookup);
    router.get('/token-invite', AuthController.getByToken);

    router.post('/login', AuthController.login);
    router.post('/logout', AuthController.logout);
    router.post('/otp-lockout', AuthController.lockoutFromOtpEmail);
    router.post('/refresh-token', AuthController.refreshTokens);
    router.post('/request-reset', AuthController.requestReset);
    router.post('/signup', AuthController.signup);

    router.put('/setup-password', AuthController.setupPasswords);

    return router;
  }
}

export type AuthRoutesType = typeof AuthRoutes.prototype;
