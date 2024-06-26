import { Router } from 'express';

import { AuthRoutes } from '@dx/auth';
import { EmailRoutes } from '@dx/email';
import { ShortlinkRoutes } from '@dx/shortlink';
import { UserRoutes } from '@dx/user';

export class RoutesV1 {
  static configure() {
    const router = Router();
    router.use('/auth', AuthRoutes.configure());
    router.use('/email', EmailRoutes.configure());
    router.use('/shortlink', ShortlinkRoutes.configure());
    router.use('/user', UserRoutes.configure());

    return router;
  }
}

export type RoutesV1Type = typeof RoutesV1.prototype;
