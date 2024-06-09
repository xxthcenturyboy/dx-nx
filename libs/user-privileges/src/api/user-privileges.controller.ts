import { Request, Response } from 'express';

import { UserPrivilegesService } from './user-privileges.service';

export class UserPrivilegesController {
  public getData(req: Request, res: Response) {
    const service = new UserPrivilegesService();
    return res.send(service.getData());
  }
}

export type UserPrivilegesControllerType =
  typeof UserPrivilegesController.prototype;
