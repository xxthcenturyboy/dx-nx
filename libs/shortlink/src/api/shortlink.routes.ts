import { Router } from 'express';
import {
  ShortlinkController,
  ShortlinkControllerType,
} from './shortlink.controller';

export class ShortlinkRoutes {
  shortlinkController: ShortlinkControllerType;
  router: Router;
  routes: Router[];

  constructor() {
    this.shortlinkController = new ShortlinkController();
    this.router = Router();
    this.routes = [];
  }

  private loadRoutes() {
    this.routes.push(this.router.get('/', this.shortlinkController.getData));
  }

  public getRoutes(): Router {
    this.loadRoutes();
    this.router.use('/shortlink', this.routes);
    return this.router;
  }

  static configure() {
    const shortlinkController = new ShortlinkController();
    const router = Router();
    const routes: Router[] = [];

    routes.push(router.get('/', shortlinkController.getData));

    return routes;
  }
}

export type ShortlinkRoutesType = typeof ShortlinkRoutes.prototype;
