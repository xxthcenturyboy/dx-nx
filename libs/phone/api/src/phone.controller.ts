import { Request, Response } from 'express';

import { sendBadRequest, sendOK } from '@dx/utils-api-http-response';
import { PhoneService } from './phone.service';
import {
  CreatePhonePayloadType,
  UpdatePhonePayloadType,
} from '@dx/phone-shared';

export const PhoneController = {
  checkAvailability: async function (req: Request, res: Response) {
    try {
      const service = new PhoneService();
      const { phone, regionCode } = req.body as { phone: string, regionCode: string };
      await service.isPhoneAvailableAndValid(phone, regionCode);
      return sendOK(req, res, { isAvailable: true });

    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  createPhone: async function (req: Request, res: Response) {
    try {
      const service = new PhoneService();
      const result = await service.createPhone(
        req.body as CreatePhonePayloadType
      );
      if (result.id) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Phone could not be created.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  deletePhone: async function (req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
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

  deletePhoneUserProfile: async function (req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const service = new PhoneService();
      const result = await service.deletePhone(id, req.user?.id);
      if (result.id) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Phone could not be deleted.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  deletePhoneTest: async function (req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const service = new PhoneService();
      const result = await service.deleteTestPhone(id);
      return sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  updatePhone: async function (req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const service = new PhoneService();
      const result = await service.updatePhone(
        id,
        req.body as UpdatePhonePayloadType
      );
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
