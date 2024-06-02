import { Router } from "express";
import {
  HealthzController,
  HealthzControllerType
} from "./healthz.controller";

export class HealthzRoutes {
  private healthzController: HealthzControllerType;
  private router: Router;
  private routes: Router[];

  constructor() {
    this.healthzController = new HealthzController();
    this.router = Router();
    this.routes = [];
  }

  private loadHttpRoutes() {
    this.routes.push(
      this.router.get('/http', this.healthzController.getHttpHealthz)
    );
  }

  public getRoutes(): Router {
    this.loadHttpRoutes();
    this.router.use('/healthz', this.routes);
    return this.router;
  }

  static configure() {
    const healthzController = new HealthzController();
    const router = Router();
    const routes: Router[] = [];

    routes.push(router.get('/', healthzController.getHttpHealthz));

    return routes;
  }
}

export type HealthzRoutesType = typeof HealthzRoutes.prototype;
