import {
  Request,
  Response
} from 'express';
import jwt from 'jsonwebtoken';

import {
  GenerateTokenParams,
  GenerateTokenResponse,
  JwtPayloadType,
  TokenExpiration
} from '../model/token.types';
import {
  DxDateUtilClass,
  randomId
} from '@dx/utils';
import {
  ApiLoggingClass
} from '@dx/logger';
import { APP_DOMAIN } from '@dx/config';
import { JWT_SECRET } from '@dx/config';
import { UserModel } from '@dx/user';

export class TokenService {
  public static issuer = `accounts.${APP_DOMAIN}`;

  public static generateTokens(
    userId: string,
    params?: GenerateTokenParams
  ): GenerateTokenResponse {
    const accessExpOptions: TokenExpiration = params?.accessToken
      ? params?.accessToken
      : {
        time: 30,
        unit: 'minutes',
        addSub: 'ADD'
      };
    const refreshExpOptions: TokenExpiration = params?.refreshToken
      ? params?.refreshToken
      : {
        time: 2,
        unit: 'days',
        addSub: 'ADD'
      };

    const accessTokenExp = DxDateUtilClass.getTimestamp(
      accessExpOptions.time,
      accessExpOptions.unit,
      accessExpOptions.addSub
    );
    const accessToken = jwt.sign(
      {
        _id: userId,
        issuer: TokenService.issuer,
        // sub: randomId().toString()
      },
      JWT_SECRET,
      {
        expiresIn: `${accessExpOptions.time} ${accessExpOptions.unit}`
      }
    );

    const refreshTokenExp = DxDateUtilClass.getTimestamp(
      refreshExpOptions.time,
      refreshExpOptions.unit,
      refreshExpOptions.addSub
    );
    const refreshToken = jwt.sign(
      {
        _id: userId,
        issuer: TokenService.issuer,
        // sub: randomId().toString()
      },
      JWT_SECRET,
      {
        expiresIn: `${refreshExpOptions.time} ${refreshExpOptions.unit}`
      }
    );

    return {
      accessToken,
      accessTokenExp,
      refreshToken,
      refreshTokenExp
    };
  }

  public static getUserIdFromToken(token: string): string {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as JwtPayloadType;
      return payload._id || '';
    } catch (err) {
      ApiLoggingClass.instance.logError(err);
    }
    return '';
  }

  public static async isRefreshValid(refreshToken: string): Promise<string | boolean> {
    try {
      const user = await UserModel.getByRefreshToken(refreshToken);
      if (!user) {
        const userId = TokenService.getUserIdFromToken(refreshToken);
        if (!userId) {
          return false;
        }

        // this user has been hacked
        await UserModel.clearRefreshTokens(userId);
        return false;
      }

      return user.id;
    } catch (err) {
      ApiLoggingClass.instance.logError(err);
      return false;
    }
  }
}

export type TokenServiceType = typeof TokenService.prototype;
