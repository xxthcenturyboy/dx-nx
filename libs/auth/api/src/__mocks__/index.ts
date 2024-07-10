// import { Request, Response } from 'express';
import {
  GenerateTokenParams,
  GenerateTokenResponse,
} from '../token.types';
import { TEST_EXISTING_USER_ID } from '@dx/config-shared';

export class TokenService {
  public static generateTokens(
    userId: string,
    params?: GenerateTokenParams
  ): GenerateTokenResponse {
    return {
      accessToken: '',
      accessTokenExp: 1,
      refreshToken: '',
      refreshTokenExp: 1,
    };
  }

  public static getUserIdFromToken(token: string): string {
    return TEST_EXISTING_USER_ID;
  }

  public static isRefreshValid(token: string): string | boolean {
    return '';
  }
}

export type TokenServiceType = typeof TokenService.prototype;
