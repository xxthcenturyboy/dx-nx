import { Request, Response } from 'express';

import { EmailService } from './email.service';

export const EmailController = {
  getData: function (req: Request, res: Response) {
    const service = new EmailService();
    res.send(service.getData());
  },
};

export type EmailControllerType = typeof EmailController;
