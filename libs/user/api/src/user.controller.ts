import { Request, Response } from 'express';

import { UserService } from './user.service';
import { sendBadRequest, sendOK } from '@dx/utils-api-http-response';
import { HeaderService } from '@dx/utils-api-headers';
import { TokenService } from '@dx/auth-api';
import {
  GetUserQueryType,
  GetUsersListQueryType,
  UpdateUsernamePayloadType,
  UpdatePasswordPayloadType,
  UpdateUserPayloadType,
} from './user.types';
import { CreateUserPayloadType } from '@dx/user-shared';

export const UserController = {
  checkUsernameAvailability: async function (req: Request, res: Response) {
    try {
      const { username } = req.query as { username: string };
      const service = new UserService();
      const result = await service.isUsernameAvailable(username);
      return sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  createUser: async function (req: Request, res: Response) {
    try {
      const service = new UserService();
      const result = await service.createUser(
        req.body as CreateUserPayloadType
      );
      if (result) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Could not create user.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  deleteUser: async function (req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const service = new UserService();
      const result = await service.deleteUser(id);
      if (result) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Could not delete user.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  deleteUserTest: async function (req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const service = new UserService();
      const result = await service.deleteTestUser(id);
      return sendOK(req, res, result);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  getUser: async function (req: Request, res: Response) {
    try {
      const { id } = req.params as GetUserQueryType;
      const service = new UserService();
      const result = await service.getUser(id);
      if (result) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Could not get user.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  getUserProfile: async function (req: Request, res: Response) {
    try {
      const authToken = HeaderService.getTokenFromAuthHeader(req);
      const userId = TokenService.getUserIdFromToken(authToken);
      const service = new UserService();
      const result = await service.getProfile(userId);
      if (result) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `No profile for this user.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  getUsersList: async function (req: Request, res: Response) {
    try {
      const service = new UserService();
      const result = await service.getUserList(
        req.query as GetUsersListQueryType
      );
      if (result) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Could not get user list.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  sendOtpCode: async function (req: Request, res: Response) {
    try {
      const authToken = HeaderService.getTokenFromAuthHeader(req);
      const userId = TokenService.getUserIdFromToken(authToken);
      const service = new UserService();
      const result = await service.sendOtpCode(userId);
      if (result) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Code could not be sent.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  updatePassword: async function (req: Request, res: Response) {
    try {
      const service = new UserService();
      const result = await service.updatePassword(
        req.body as UpdatePasswordPayloadType
      );
      if (result) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Could not update password.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  updateRolesRestrictions: async function (req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const service = new UserService();
      const result = await service.updateRolesAndRestrictions(
        id,
        req.body as UpdateUserPayloadType
      );
      if (result) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Could not update user.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  updateUser: async function (req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const service = new UserService();
      const result = await service.updateUser(
        id,
        req.body as UpdateUserPayloadType
      );
      if (result) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Could not update user.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },

  updateUserName: async function (req: Request, res: Response) {
    try {
      const { id } = req.params as { id: string };
      const service = new UserService();
      const result = await service.updateUserName(
        id,
        req.body as UpdateUsernamePayloadType
      );
      if (result) {
        return sendOK(req, res, result);
      }

      sendBadRequest(req, res, `Could not update username.`);
    } catch (err) {
      sendBadRequest(req, res, err.message);
    }
  },
};

export type UserControllerType = typeof UserController;
