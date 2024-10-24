import { Request, Response } from 'express';

import { sendBadRequest, sendOK } from '@dx/utils-api-http-response';
import { EmailService } from './email.service';
import {
  CreateEmailPayloadType,
  UpdateEmailPayloadType,
} from '@dx/email-shared';

export const EmailController = {
  checkAvailability: async function (req: Request, res: Response) {
    try {
      const service = new EmailService();
      const { email } = req.body as { email: string };
      await service.isEmailAvailableAndValid(email);
      return sendOK(req, res, { isAvailable: true });

    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  createEmail: async function (req: Request, res: Response) {
    try {
      const service = new EmailService();
      const result = await service.createEmail(
        req.body as CreateEmailPayloadType
      );
      if (result.id) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Email could not be created.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  deleteEmail: async function (req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const service = new EmailService();
      const result = await service.deleteEmail(id);
      if (result.id) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Email could not be deleted.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  deleteEmailUserProfile: async function (req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const service = new EmailService();
      const result = await service.deleteEmail(id, req.user?.id);
      if (result.id) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Email could not be deleted.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  deleteEmailTest: async function (req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const service = new EmailService();
      const result = await service.deleteTestEmail(id);
      return sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  updateEmail: async function (req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const service = new EmailService();
      const result = await service.updateEmail(
        id,
        req.body as UpdateEmailPayloadType
      );
      if (result.id) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Email could not be updated.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  validateTestEmail: async function (req: Request, res: Response) {
    try {
      const { email } = req.body as { email: string };
      const service = new EmailService();
      await service.validateTestEmail(email);
      return sendOK(req, res, {});
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },
};

export type EmailControllerType = typeof EmailController;
