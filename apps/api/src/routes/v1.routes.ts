import { Router } from 'express';

import {
  UserRoutes
} from '@dx/user';

export class RoutesV1 {
  static configure() {
    const router = Router();
    router.use('/user', UserRoutes.configure());

    return router;
  }
}

export type RoutesV1Type = typeof RoutesV1.prototype;
