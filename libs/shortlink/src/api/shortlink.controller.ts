import { Request, Response } from 'express';

import { ShortlinkService } from './shortlink.service';

export class ShortlinkController {
  public getData(req: Request, res: Response) {
    const service = new ShortlinkService();
    return res.send(service.getData());
  }
}

export type ShortlinkControllerType = typeof ShortlinkController.prototype;
