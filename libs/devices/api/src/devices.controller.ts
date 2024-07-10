import { Request, Response } from 'express';

import { DevicesService } from './devices.service';
import { sendBadRequest, sendOK } from '@dx/utils-api-http-response';

export const DevicesController = {
  disconnectDevice: async function (req: Request, res: Response) {
    try {
      const service = new DevicesService();
      const { id } = req.params as { id: string };
      const result = await service.disconnectDevice(id);
      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  updateFcmToken: async function (req: Request, res: Response) {
    try {
      const service = new DevicesService();
      const { fcmToken } = req.body as {
        fcmToken: string;
      };
      const userId = req.user?.id || '';
      const result = await service.updateFcmToken(userId, fcmToken);
      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  updatePublicKey: async function (req: Request, res: Response) {
    try {
      const service = new DevicesService();
      const { uniqueDeviceId, biometricPublicKey } = req.body as {
        uniqueDeviceId: string;
        biometricPublicKey: string;
      };
      const result = await service.updatePublicKey(
        uniqueDeviceId,
        biometricPublicKey
      );
      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },
};

export type DevicesControllerType = typeof DevicesController;
