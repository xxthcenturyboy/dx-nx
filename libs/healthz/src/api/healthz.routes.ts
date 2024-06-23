import { Router } from "express";
import { HealthzController } from "./healthz.controller";

export class HealthzRoutes {
  static configure() {
    const healthzController = new HealthzController();
    const router = Router();

    router.get('/', healthzController.getHttpHealthz);

    return router;
  }
}

export type HealthzRoutesType = typeof HealthzRoutes.prototype;
