import { Request, Response } from 'express';

import { UserService } from './user.service';

export class UserController {
  public getData(req: Request, res: Response) {
    const service = new UserService();
    return res.send(service.getData());
  }
}

export type UserControllerType = typeof UserController.prototype;
