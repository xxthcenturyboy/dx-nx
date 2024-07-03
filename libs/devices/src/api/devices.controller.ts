import {
  Request,
  Response
} from 'express';

import { DevicesService } from './devices.service';
import {
  sendBadRequest,
  sendOK
} from '@dx/server';

export const DevicesController = {
  disconnectDevice: async function (req: Request, res: Response) {
    try {
      const service = new DevicesService();
      const { id } = req.params as { id: string }
      const result = await service.disconnectDevice(id);
      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  updateDevice: async function (req: Request, res: Response) {
    try {
      const service = new DevicesService();
      const {
        deviceId,
        biometricPublicKey
      } = req.body as {
        deviceId: string,
        biometricPublicKey: string
      };
      const result = await service.updateDevice(deviceId, biometricPublicKey);
      sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  }
};

export type DevicesControllerType = typeof DevicesController;
