import { Router } from 'express';
import {
  UserPrivilegesController,
  UserPrivilegesControllerType,
} from './user-privileges.controller';

export class UserPrivilegesRoutes {
  userprivilegesController: UserPrivilegesControllerType;
  router: Router;
  routes: Router[];

  constructor() {
    this.userprivilegesController = new UserPrivilegesController();
    this.router = Router();
    this.routes = [];
  }

  private loadRoutes() {
    this.routes.push(
      this.router.get('/', this.userprivilegesController.getData)
    );
  }

  public getRoutes(): Router {
    this.loadRoutes();
    this.router.use('/user-privileges', this.routes);
    return this.router;
  }

  static configure() {
    const userprivilegesController = new UserPrivilegesController();
    const router = Router();
    const routes: Router[] = [];

    routes.push(router.get('/', userprivilegesController.getData));

    return routes;
  }
}

export type UserPrivilegesRoutesType = typeof UserPrivilegesRoutes.prototype;
