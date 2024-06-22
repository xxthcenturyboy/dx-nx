import {
  Request,
  Response,
  NextFunction
} from 'express';
import { ApiLoggingClass } from '@dx/logger';
import { HttpResponse } from '@dx/server';
import {
  UserModel,
  USER_ROLE
} from '@dx/user';

export async function userHasRole(
  userId: string,
  role: string
): Promise<boolean> {
  try {
    return await UserModel.userHasRole(userId, role);
  } catch (err) {
    ApiLoggingClass.instance.logError(err);
    return false;
  }
};

export async function hasAdminRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.session.userId;
    if (!userId) {
      throw new Error('No user ID');
    }

    const hasSuperAdminRole = await userHasRole(userId, USER_ROLE.SUPER_ADMIN);
    if (hasSuperAdminRole) {
      next();
      return;
    }

    const hasRole = await UserModel.userHasRole(userId, USER_ROLE.ADMIN);
    if (!hasRole) {
      throw new Error('User is not authorized for this activity.');
    }

    next();
  } catch (err) {
    const msg = err.message || err;
    ApiLoggingClass.instance.logError(msg);
    const httpResponse = new HttpResponse();
    httpResponse.sendUnauthorized(req, res, msg);
  }
};

export async function hasSuperAdminRole(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.session.userId;
    if (!userId) {
      throw new Error('No user ID');
    }
    const hasRole = await userHasRole(userId, USER_ROLE.SUPER_ADMIN);

    if (!hasRole) {
      throw new Error('User is not authorized for this activity.');
    }

    next();
  } catch (err) {
    const msg = err.message || err;
    ApiLoggingClass.instance.logError(msg);
    ApiLoggingClass.instance.logError(err);
    const httpResponse = new HttpResponse();
    httpResponse.sendUnauthorized(req, res, msg);
  }
};
