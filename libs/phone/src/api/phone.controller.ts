import { Request, Response } from 'express';

import { PhoneService } from './phone.service';

export const PhoneController = {
  getData: function (req: Request, res: Response) {
    const service = new PhoneService();
    res.send(service.getData());
  },
};

export type PhoneControllerType = typeof PhoneController;
