// import { Request, Response } from 'express';
import { TEST_EXISTING_USER_ID } from '@dx/config-shared';
import {
  GenerateTokenParams,
  GenerateTokenResponse,
} from '../token.types';

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
    if (token) {
      return TEST_EXISTING_USER_ID;
    }

    return '';
  }

  public static isRefreshValid(token: string): string | boolean {
    return '';
  }
}

export type TokenServiceType = typeof TokenService.prototype;
