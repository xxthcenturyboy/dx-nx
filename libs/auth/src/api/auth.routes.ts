import { Router } from 'express';
import { AuthController } from './auth.controller';

export class AuthRoutes {
  static configure() {
    const router = Router();

    router.get('/lookup', AuthController.userLookup);
    router.get('/token-invite', AuthController.getByToken);
    router.post('/signup', AuthController.signup);

    return router;
  }
}

export type AuthRoutesType = typeof AuthRoutes.prototype;
