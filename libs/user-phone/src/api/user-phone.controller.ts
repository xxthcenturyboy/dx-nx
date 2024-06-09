import { Request, Response } from 'express';

import { UserPhoneService } from './user-phone.service';

export class UserPhoneController {
  public getData(req: Request, res: Response) {
    const service = new UserPhoneService();
    return res.send(service.getData());
  }
}

export type UserPhoneControllerType = typeof UserPhoneController.prototype;
