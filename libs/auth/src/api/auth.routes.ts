import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';

import { AuthController } from './auth.controller';
import { DxRateLimiters} from '@dx/server';

export class AuthRoutes {
  static configure() {
    const router = Router();
    router.get('/lookup', DxRateLimiters.authLookup(), AuthController.authLookup);
    router.get('/validate/email/:token', DxRateLimiters.strict(), AuthController.validateEmail);

    router.post('/account', DxRateLimiters.veryStrict(), AuthController.createAccount);
    router.post('/login', DxRateLimiters.login(), AuthController.login);
    router.post('/logout', AuthController.logout);
    router.post('/otp-code/send/email', DxRateLimiters.veryStrict(), AuthController.sendOtpToEmail);
    router.post('/otp-code/send/phone', DxRateLimiters.veryStrict(), AuthController.sendOtpToPhone);
    router.post('/refresh-token', DxRateLimiters.veryStrict(), AuthController.refreshTokens);

    return router;
  }
}

export type AuthRoutesType = typeof AuthRoutes.prototype;
