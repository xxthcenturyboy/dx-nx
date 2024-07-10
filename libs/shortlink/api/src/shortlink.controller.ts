import { Request, Response } from 'express';

import { sendBadRequest, sendOK } from '@dx/utils-api-http-response';
import { ShortlinkService } from './shortlink.service';

export const ShortlinkController = {
  redirectToTarget: async function (req: Request, res: Response) {
    try {
      const { id } = req.query as { id: string };
      const service = new ShortlinkService();
      const result = await service.getShortlinkTarget(id);
      if (result) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, 'No target for this url.');
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },
};

export type ShortlinkControllerType = typeof ShortlinkController;
