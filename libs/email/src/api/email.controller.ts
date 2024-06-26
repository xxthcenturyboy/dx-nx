import {
  Request,
  Response
} from 'express';

import { EmailService } from './email.service';
import { CreateEmailPayloadType } from '../model/email.types';
import {
  sendBadRequest,
  sendOK
} from '@dx/server';

export const EmailController = {
  createEmail: async function(req: Request, res: Response) {
    try {
      const service = new EmailService();
      const result = await service.createEmail(req.body as CreateEmailPayloadType);
      if (result.id) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Email could not be created.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  validateEmail: async function(req: Request, res: Response) {
    try {
      const { token } = req.body as { token: string };
      const service = new EmailService();
      const result = await service.validateEmail(token);
      if (result.id) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Email could not be found with the token: ${token}`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  }
};

export type EmailControllerType = typeof EmailController;
