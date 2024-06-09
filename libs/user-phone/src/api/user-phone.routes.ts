import { Router } from 'express';
import {
  UserPhoneController,
  UserPhoneControllerType,
} from './user-phone.controller';

export class UserPhoneRoutes {
  userphoneController: UserPhoneControllerType;
  router: Router;
  routes: Router[];

  constructor() {
    this.userphoneController = new UserPhoneController();
    this.router = Router();
    this.routes = [];
  }

  private loadRoutes() {
    this.routes.push(this.router.get('/', this.userphoneController.getData));
  }

  public getRoutes(): Router {
    this.loadRoutes();
    this.router.use('/user-phone', this.routes);
    return this.router;
  }

  static configure() {
    const userphoneController = new UserPhoneController();
    const router = Router();
    const routes: Router[] = [];

    routes.push(router.get('/', userphoneController.getData));

    return routes;
  }
}

export type UserPhoneRoutesType = typeof UserPhoneRoutes.prototype;
