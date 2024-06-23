import { Request, Response } from 'express';

import { AuthService } from './auth.service';

export const AuthController = {
  getData: function(req: Request, res: Response) {
    const service = new AuthService();
    return res.send(service.getData());
  }
};

export type AuthControllerType = typeof AuthController;
