import { Router } from 'express';

import { AuthRoutes } from '@dx/auth-api';
import { DevicesRoutes } from '@dx/devices-api';
import { EmailRoutes } from '@dx/email-api';
import { HealthzRoutes } from '@dx/healthz-api';
import { PhoneRoutes } from '@dx/phone-api';
import { ShortlinkRoutes } from '@dx/shortlink-api';
import { UserPrivilegeRoutes } from '@dx/user-privilege-api';
import { UserRoutes } from '@dx/user-api';

export class RoutesV1 {
  static configure() {
    const router = Router();
    router.use('/auth', AuthRoutes.configure());
    router.use('/device', DevicesRoutes.configure());
    router.use('/email', EmailRoutes.configure());
    router.use('/healthz', HealthzRoutes.configure());
    router.use('/phone', PhoneRoutes.configure());
    router.use('/privilege-set', UserPrivilegeRoutes.configure());
    router.use('/shortlink', ShortlinkRoutes.configure());
    router.use('/user', UserRoutes.configure());

    return router;
  }
}

export type RoutesV1Type = typeof RoutesV1.prototype;
