import { Request, Response } from 'express';

import { AuthService } from './auth.service';

export class AuthController {
  public getData(req: Request, res: Response) {
    const service = new AuthService();
    return res.send(service.getData());
  }
}

export type AuthControllerType = typeof AuthController.prototype;
