import { Request, Response } from 'express';

import { sendBadRequest, sendOK } from '@dx/utils-api-http-response';
import { UserPrivilegeService } from './user-privilege.service';
import { UpdatePrivilegeSetPayloadType } from './user-privilege.types';

export const PrivilegeSetController = {
  getAllPrivilegeSets: async function (req: Request, res: Response) {
    try {
      const service = new UserPrivilegeService();
      const result = await service.getAllPrivilegeSets();
      if (Array.isArray(result)) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `No privilege sets found.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  updatePrivilegeSet: async function (req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const service = new UserPrivilegeService();
      const result = await service.updatePrivilegeSet(
        id,
        req.body as UpdatePrivilegeSetPayloadType
      );
      if (result.id) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Privilege set could not be updated.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },
};

export type PrivilegeSetControllerType = typeof PrivilegeSetController;
