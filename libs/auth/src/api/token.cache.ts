import {
  ApiLoggingClass,
  ApiLoggingClassType
} from "@dx/logger";
import {
  RedisService,
  RedisServiceType,
  REDIS_DELIMITER
} from "@dx/redis";
import { parseJson } from "@dx/utils";
import { RefreshCacheType } from "../model/token.types";

export class TokenCache {
  keyPrefix = 'refresh-token';
  logger: ApiLoggingClassType
  redis: RedisServiceType;

  constructor() {
    this.logger = ApiLoggingClass.instance;
    this.redis = RedisService.instance;
  }

  private getFormattedKeyName(keyValue: string) {
    return `${this.keyPrefix}${REDIS_DELIMITER}${keyValue}`;
  }

  public async setCache (userId: string, keyArray: RefreshCacheType): Promise<boolean> {
    if (
      !keyArray
      || !userId
    ) {
      return false;
    }

    const key = this.getFormattedKeyName(userId);
    const data = JSON.stringify(keyArray);

    try {
      return await this.redis.setCacheItem(key, data);;
    } catch (err) {
      this.logger.logError(err);
      return false;
    }
  }

  public async getCache(userId: string): Promise<RefreshCacheType | null> {
    if (!userId) {
      return null;
    }

    const key = this.getFormattedKeyName(userId);
    try {
      const data = await this.redis.getCacheItem<string>(key);
      if (data) {
        return parseJson<RefreshCacheType>(data);
      }
    } catch (err) {
      this.logger.logError(err);
      return null;
    }

    return null;
  }

  public async deleteCache (userId: string): Promise<boolean> {
    if (!userId) {
      return false;
    }

    const key = this.getFormattedKeyName(userId);
    try {
      return await this.redis.deleteCacheItem(key);
    } catch (err) {
      this.logger.logError(err);
    }

    return false;
  }
}

export type TokenCacheType = typeof TokenCache.prototype;
