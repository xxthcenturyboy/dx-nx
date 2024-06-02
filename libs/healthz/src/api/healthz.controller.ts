import {
  Request,
  Response
} from "express";

import { HttpHealthzService } from "./http-healthz.service";

export class HealthzController {
  public getHttpHealthz(req: Request, res: Response) {
    const service = new HttpHealthzService();
    return res.send(service.getMessage());
  }
}

export type HealthzControllerType = typeof HealthzController.prototype;
