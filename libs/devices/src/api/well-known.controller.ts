import { Request, Response } from 'express';

import { WellKnownSourcesService } from './well-known.dx-mobile.service';
import { sendOK } from '@dx/server';

export const WellKnownController = {
  getAndroidData: function (req: Request, res: Response) {
    res.set('Content-Type', 'application/pkcs7-mime');
    const data = WellKnownSourcesService.getAndroidData();
    sendOK(req, res, data);
  },
  getAppleData: function (req: Request, res: Response) {
    res.set('Content-Type', 'application/pkcs7-mime');
    const data = WellKnownSourcesService.getAppleData();
    sendOK(req, res, data);
  },
};

export type WellKnownControllerType = typeof WellKnownController;
