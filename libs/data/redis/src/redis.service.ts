import { Redis } from 'ioredis';

import { ApiConfigType } from '@dx/config';
import { ApiLoggingClassType } from '@dx/logger';
import { REDIS_DELIMITER } from './redis.consts';
import { RedisExpireOptions } from './redis.types';
import {
  isNumber,
  parseJson
} from '@dx/utils';

export class RedisService {
  cache: typeof Redis.Cluster.prototype | typeof Redis.prototype;
  logger: ApiLoggingClassType;

  constructor(params: ApiConfigType) {
    if (params.isLocal) {
      const url = `${params.redis.url}:${params.redis.port}/0`;
      this.cache = new Redis(url, {
        keyPrefix: `${params.redis.prefix}${REDIS_DELIMITER}`
      });
    } else {
      const hosts = params.redis.url.split('|');
      console.log(`trying to connect to: Redis Cluster ${JSON.stringify(hosts)}`);
      this.cache = new Redis.Cluster(hosts, {
        redisOptions: {
          tls: {
            checkServerIdentity: () => undefined
          }
        },
        scaleReads: 'slave',
        keyPrefix: `${params.redis.prefix}${REDIS_DELIMITER}`
      });
    }

    this.logger = params.logger;
  }

  public async setCacheItem(
    key: string,
    data: string
  ) {
    if (
      !key
      && !data
    ) {
      return false;
    }

    try {
      const save = await this.cache.set(key, data);
      return save === 'OK';
    } catch (error) {
      this.logger.logError((error as Error).message, error);
      return false;
    }
  }

  public async setCacheItemWithExpiration(
    key: string,
    data: string,
    expireOptions: RedisExpireOptions
  ) {
    if (
      !key
      && !data
    ) {
      return false;
    }

    try {
      // @ts-expect-error - types are ok here
      const save = await this.cache.set(key, data, expireOptions.token, expireOptions.time);
      return save === 'OK';
    } catch (error) {
      this.logger.logError((error as Error).message, error);
      return false;
    }
  }

  public async getCacheItem<TData>(key: string) {
    if (!key) {
      return null;
    }

    try {
      const data = await this.cache.get(key);
      if (data) {
        return parseJson<TData>(data) as TData;
      }

      return null;
    } catch (error) {
      this.logger.logError((error as Error).message, error);
      return null;
    }
  }

  public async deleteCacheItem(key: string) {
    if (!key) {
      return false;
    }

    try {
      const data = await this.cache.del(key);
      return isNumber(data);
    } catch (error) {
      this.logger.logError((error as Error).message, error);
      return false;
    }
  }

  public async getKeys() {
    return await this.cache.keys('*');
  }
}

export type RedisServiceType = typeof RedisService.prototype;
