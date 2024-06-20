import {
  Request,
  Response
} from "express";

export class TokenService {
  private req: Request;
  private res: Response;

  constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
  }

  public async issueAll() {
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  public async reissueFromRefresh(refreshToken: string) {
    return new Promise((resolve) => {
      resolve(!!refreshToken);
    });
  }

  public invalidateTokens(res: Response) {
    return true;
  }

  public async hasRefreshBeenUsed(refreshToken: string) {
    return new Promise((resolve) => {
      resolve(!!refreshToken);
    });
  }
}

export type TokenServiceType = typeof TokenService.prototype;

export class TokenCache {
  setCache(userId: string, keyArray: any) {
    console.log('tryna set cache');
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  getCache(userId: string) {
    console.log('tryna get cache');
    return new Promise((resolve) => {
      resolve({ data: userId });
    });
  }

  deleteCache(userId: string) {
    return new Promise((resolve) => {
      resolve(true);
    });
  }
}
