import {
  CookieOptions,
  Request,
  Response
} from 'express';
import * as jwt from 'jwt-simple';

import {
  JwtPayloadType,
  RefreshCacheType
} from '../model/token.types';
import { AUTH_TOKEN_NAMES } from '../model/auth.consts';
import { DxDateUtilClass } from '@dx/utils';
import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger';
import { APP_DOMAIN } from '@dx/config';
import {
  TokenCache,
  TokenCacheType
} from './token.cache';
import { JWT_SECRET } from '@dx/config';

export class TokenService {
  public audience: string;
  public issuer = `accounts.${APP_DOMAIN}`;
  private logger: ApiLoggingClassType;
  private refreshHistory: RefreshCacheType | null;
  private req: Request;
  private res: Response;
  public token: string;
  private tokenCache: TokenCacheType;
  public userId: string | undefined;

  constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
    this.tokenCache = new TokenCache();
    this.refreshHistory = null;
    this.token = this.req?.cookies?.token || '';
    // @ts-expect-error - will have session
    this.userId = this.req?.session?.userId;
    this.audience = this.userId || 'user';
    this.logger = ApiLoggingClass.instance;
  }

  public async issueAll(): Promise<boolean> {
    try {
      const { token, exp } = this.createToken();
      const refresh = await this.createRefreshToken();

      const tokenOptions = this.getTokenOptions(exp);

      this.res.cookie(AUTH_TOKEN_NAMES.AUTH, token, tokenOptions);
      refresh && this.res.cookie(AUTH_TOKEN_NAMES.REFRESH, refresh, { httpOnly: true, secure: true });
      this.res.cookie(AUTH_TOKEN_NAMES.EXP, exp);
      return true;
    } catch (err) {
      this.logger.logError(err);
      return false;
    }
  }

  public async reissueFromRefresh(refreshToken: string): Promise<boolean> {
    const consumed = await this.consumeRefreshToken(refreshToken);
    if (!consumed) {
      return false;
    }

    return await this.issueAll();
  }

  public invalidateTokens (res: Response): boolean {
    if (res) {
      const options = {
        httpOnly: true,
        expires: new Date(Date.now() + 5 * 1000)
      };

      res.cookie(AUTH_TOKEN_NAMES.AUTH, 'none', options);
      res.cookie(AUTH_TOKEN_NAMES.REFRESH, 'none', options);
      res.cookie(AUTH_TOKEN_NAMES.EXP, 'none', options);
      if (this.userId) {
        void this.tokenCache.deleteCache(this.userId);
      }
      return true;
    }

    return false;
  }

  public async hasRefreshBeenUsed (refreshToken: string): Promise<boolean> {
    if (!refreshToken) {
      return true;
    }

    await this.getRefreshHistory();

    if (!this.refreshHistory) {
      return true;
    }

    return this.refreshHistory[refreshToken];
  }

  private getTokenOptions (exp: number): CookieOptions {
    return {
      httpOnly: true,
      expires: new Date(exp * 1000),
      secure: true,
    };
  }

  private setAccessToken(): boolean {
    try {
      const { token, exp } = this.createToken();

      const tokenOptions = this.getTokenOptions(exp);

      this.res.cookie(AUTH_TOKEN_NAMES.AUTH, token, tokenOptions);
      this.res.cookie(AUTH_TOKEN_NAMES.EXP, exp);
      return true;
    } catch (err) {
      this.logger.logError(err);
      return false;
    }
  }

  private async getRefreshHistory (): Promise<void> {
    if (!this.userId) {
      return;
    }

    this.refreshHistory = await this.tokenCache.getCache(this.userId);
  }

  private async addRefreshToHistory(refreshToken: string): Promise<boolean> {
    if (!refreshToken || !this.userId) {
      return false;
    }

    if (!this.refreshHistory) {
      await this.getRefreshHistory();
    }

    if (!this.refreshHistory) {
      this.refreshHistory = {
        [refreshToken]: false
      };
    } else {
      this.refreshHistory = {
        ...this.refreshHistory,
        [refreshToken]: false
      };
    }

    return await this.tokenCache.setCache(this.userId, this.refreshHistory);
  }

  private async consumeRefreshToken (refreshToken: string): Promise<boolean> {
    if (!refreshToken || !this.userId) {
      return false;
    }

    if (!this.refreshHistory) {
      await this.getRefreshHistory();
    }

    if (!this.refreshHistory) {
      return false;
    }

    this.refreshHistory[refreshToken] = true;
    return await this.tokenCache.setCache(this.userId, this.refreshHistory);
  }

  private createToken(): { token: string, exp: number} {
    const exp = DxDateUtilClass.getTimestamp(1, 'hour', 'ADD');
    const payload: JwtPayloadType = {
      exp,
      audience: this.audience,
      issuer: this.issuer,
      sub: this.userId || '',
    };
    return {
      exp,
      token: jwt.encode(payload, JWT_SECRET)
    };
  }

  private async createRefreshToken(): Promise<string | false> {
    const refreshToken = `${new Date().getTime()}-${Math.random}`;
    const added = await this.addRefreshToHistory(refreshToken);
    return added && refreshToken;
  }

  private isPayloadValid(payload: JwtPayloadType): boolean {
    if (!payload) {
      return false;
    }

    if (!payload.sub || payload.sub !== this.userId) {
      return false;
    }

    if (!payload.issuer || payload.issuer !== this.issuer) {
      return false;
    }

    if (!payload.audience || payload.audience !== this.audience) {
      return false;
    }

    if (!payload.exp) {
      return false;
    }

    return true;
  }

  private verifyToken(): boolean {
    try  {
      const payload = jwt.decode(this.token, JWT_SECRET) as JwtPayloadType;
      if (this.isPayloadValid(payload)) {
        const nextExpire = DxDateUtilClass.getTimestamp();
        return payload.exp > nextExpire;
      }

      return false;
    } catch (err) {
      this.logger.logError(err);
      return false;
    }
  }

  public validateToken(): boolean {
    if (this.token && this.token !== 'none') {
      const verified = this.verifyToken();
      if (verified) {
        return this.setAccessToken();
      }
    }

    return false;
  }
}

export type TokenServiceType = typeof TokenService.prototype;
