import { Router } from 'express';
import { UserController } from './user.controller';

export class UserRoutes {
  static configure() {
    const router = Router();
    const userController = new UserController();

    router.get('/', userController.getData);

    return router;
  }
}

export type UserRoutesType = typeof UserRoutes.prototype;
