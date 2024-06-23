import { Router } from 'express';
import { UserController } from './user.controller';

export class UserRoutes {
  static configure() {
    const router = Router();

    router.get('/', UserController.getUser);

    return router;
  }
}

export type UserRoutesType = typeof UserRoutes.prototype;
