import { CookieOptions, Request, Response } from 'express';

import { AUTH_TOKEN_NAMES } from '@dx/auth-api';

export class CookeiService {
  public static setCookies(
    res: Response,
    hasAccountBeenSecured: boolean,
    refreshToken: string,
    refreshTokenExpTimestamp: number
  ) {
    res.cookie(AUTH_TOKEN_NAMES.ACCTSECURE, hasAccountBeenSecured, {
      httpOnly: true,
      secure: true,
    });

    CookeiService.setRefreshCookie(res, refreshToken, refreshTokenExpTimestamp);
    // res.cookie(
    //   AUTH_TOKEN_NAMES.REFRESH,
    //   refreshToken,
    //   {
    //     httpOnly: true,
    //     maxAge: refreshTokenExpTimestamp * 1000,
    //     secure: true
    //   }
    // );
  }

  public static setRefreshCookie(
    res: Response,
    refreshToken: string,
    exp: number
  ) {
    res.cookie(AUTH_TOKEN_NAMES.REFRESH, refreshToken, {
      httpOnly: true,
      maxAge: exp * 1000,
      secure: true,
    });
  }

  public static setCookie(
    res: Response,
    cookeiName: string,
    cookieValue: any,
    cookieOptions: CookieOptions
  ) {
    if (res) {
      res.cookie(cookeiName, cookieValue, cookieOptions);

      return true;
    }

    return false;
  }

  public static getCookie(req: Request, cookeiName: string): string {
    const cookie = req?.cookies[cookeiName];
    return cookie || '';
  }

  public static clearCookies(res: Response) {
    if (res) {
      const options = {
        httpOnly: true,
        expires: new Date(Date.now() + 5 * 1000),
      };

      res.clearCookie(AUTH_TOKEN_NAMES.ACCTSECURE, options);
      res.clearCookie(AUTH_TOKEN_NAMES.AUTH, options);
      res.clearCookie(AUTH_TOKEN_NAMES.REFRESH, options);
      res.clearCookie(AUTH_TOKEN_NAMES.EXP, options);

      return true;
    }

    return false;
  }

  public static clearCookie(res: Response, cookeiName: string) {
    if (res) {
      const options = {
        httpOnly: true,
        expires: new Date(Date.now() + 5 * 1000),
      };

      res.clearCookie(cookeiName, options);

      return true;
    }

    return false;
  }
}

export type CookeiServiceType = typeof CookeiService.prototype;
