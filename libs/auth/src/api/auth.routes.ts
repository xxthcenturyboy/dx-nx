import { Router } from 'express';
import { AuthController, AuthControllerType } from './auth.controller';

export class AuthRoutes {
  authController: AuthControllerType;
  router: Router;
  routes: Router[];

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.routes = [];
  }

  private loadRoutes() {
    this.routes.push(this.router.get('/', this.authController.getData));
  }

  public getRoutes(): Router {
    this.loadRoutes();
    this.router.use('/auth', this.routes);
    return this.router;
  }

  static configure() {
    const authController = new AuthController();
    const router = Router();
    const routes: Router[] = [];

    routes.push(router.get('/', authController.getData));

    return routes;
  }
}

export type AuthRoutesType = typeof AuthRoutes.prototype;
