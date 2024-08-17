import { Router } from 'express';

import { DxRateLimiters } from '@dx/utils-api-rate-limiters';
import { AuthController } from './auth-api.controller';

export class AuthRoutes {
  static configure() {
    const router = Router();
    router.get(
      '/lookup',
      DxRateLimiters.authLookup(),
      AuthController.authLookup
    );
    router.get(
      '/refresh-token',
      DxRateLimiters.veryStrict(),
      AuthController.refreshTokens
    );
    router.get(
      '/validate/email/:token',
      DxRateLimiters.strict(),
      AuthController.validateEmail
    );

    router.post(
      '/account',
      DxRateLimiters.accountCreation(),
      AuthController.createAccount
    );
    router.post(
      '/login',
      DxRateLimiters.login(),
      AuthController.login
    );
    router.post('/logout', AuthController.logout);
    router.post(
      '/otp-code/send/email',
      DxRateLimiters.veryStrict(),
      AuthController.sendOtpToEmail
    );
    router.post(
      '/otp-code/send/phone',
      DxRateLimiters.veryStrict(),
      AuthController.sendOtpToPhone
    );

    router.delete(
      '/reject/device/:id',
      DxRateLimiters.strict(),
      AuthController.rejectDevice
    );

    return router;
  }
}

export type AuthRoutesType = typeof AuthRoutes.prototype;
