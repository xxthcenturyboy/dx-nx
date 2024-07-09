import { Redis } from 'ioredis';

import { RedisConstructorType, RedisExpireOptions } from '../redis.types';
import { REDIS_DELIMITER } from '../redis.consts';
import { ApiLoggingClass, ApiLoggingClassType } from '@dx/logger';

export class RedisService {
  cacheHandle: typeof Redis.Cluster.prototype | typeof Redis.prototype;
  static #instance: RedisServiceType;
  logger: ApiLoggingClassType;

  constructor(params: RedisConstructorType) {
    RedisService.#instance = this;
  }

  public static get instance() {
    return this.#instance;
  }

  public async setCacheItem(key: string, data: string) {
    return new Promise((resolve) => {
      resolve(!!key && !!data);
    });
  }

  public async setCacheItemWithExpiration(
    key: string,
    data: string,
    expireOptions: RedisExpireOptions
  ) {
    return new Promise((resolve) => {
      resolve(!!key && !!data && !!expireOptions);
    });
  }

  public async getCacheItem<TData>(key: string) {
    return new Promise((resolve) => {
      resolve(JSON.stringify({ data: key }) as TData);
    });
  }

  public async deleteCacheItem(key: string) {
    return new Promise((resolve) => {
      resolve(!!key);
    });
  }
}

type RedisServiceType = typeof RedisService.prototype;

export class RedisHealthzService {
  public async healthCheck() {
    return new Promise((resolve) => {
      resolve(true);
    });
  }
}
