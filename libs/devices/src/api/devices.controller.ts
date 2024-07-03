import { Request, Response } from 'express';

import { DevicesService } from './devices.service';

export const DevicesController = {
  getData: function (req: Request, res: Response) {
    const service = new DevicesService();
    res.send(service.getData());
  },
};

export type DevicesControllerType = typeof DevicesController;
