import {
  Request,
  Response
} from 'express';

import { PhoneService } from './phone.service';
import {
  CreatePhonePayloadType,
  UpdatePhonePayloadType
} from '../model/phone.types';
import {
  sendBadRequest,
  sendOK
} from '@dx/server';

export const PhoneController = {
  createPhone: async function(req: Request, res: Response) {
    try {
      const service = new PhoneService();
      const result = await service.createPhone(req.body as CreatePhonePayloadType);
      if (result.id) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Phone could not be created.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  deletePhone: async function(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string }
      const service = new PhoneService();
      const result = await service.deletePhone(id);
      if (result.id) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Phone could not be deleted.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  updatePhone: async function(req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string }
      const service = new PhoneService();
      const result = await service.updatePhone(id, req.body as UpdatePhonePayloadType);
      if (result.id) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Phone could not be updated.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },
};

export type PhoneControllerType = typeof PhoneController;
