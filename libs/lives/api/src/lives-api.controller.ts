import { Request, Response } from 'express';
import { sendOK } from '@dx/utils-api-http-response';

export const LivesController = {
  getLives: function (req: Request, res: Response) {
    sendOK(req, res, 'OK');
  },
};
