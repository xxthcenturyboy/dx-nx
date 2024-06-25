import {
  Request,
  Response
} from 'express';

import { ShortlinkService } from './shortlink.service';

export const ShortlinkController = {
  getData: function(req: Request, res: Response) {
    const service = new ShortlinkService();
    res.send(service.getData());
  }
}

export type ShortlinkControllerType = typeof ShortlinkController;
