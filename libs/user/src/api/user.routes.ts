import { Router } from 'express';
import { UserController, UserControllerType } from './user.controller';

export class UserRoutes {
  userController: UserControllerType;
  router: Router;
  routes: Router[];

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.routes = [];
  }

  private loadRoutes() {
    this.routes.push(this.router.get('/', this.userController.getData));
  }

  public getRoutes(): Router {
    this.loadRoutes();
    this.router.use('/user', this.routes);
    return this.router;
  }

  static configure() {
    const userController = new UserController();
    const router = Router();
    const routes: Router[] = [];

    routes.push(router.get('/', userController.getData));

    return routes;
  }
}

export type UserRoutesType = typeof UserRoutes.prototype;
