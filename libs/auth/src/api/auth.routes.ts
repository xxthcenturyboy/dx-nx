import { Router } from 'express';
import { AuthController } from './auth.controller';

export class AuthRoutes {
  static configure() {
    const router = Router();

    router.get('/', AuthController.getData);

    return router;
  }
}

export type AuthRoutesType = typeof AuthRoutes.prototype;
