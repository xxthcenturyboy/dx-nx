import { Redis } from 'ioredis';
import ioRedisMock from 'ioredis-mock';

import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger';
import {
  REDIS_DELIMITER
} from './redis.consts';
import {
  RedisConstructorType,
  RedisExpireOptions
} from './redis.types';
import {
  isNumber,
  parseJson
} from '@dx/utils';

export class RedisService {
  cacheHandle: typeof Redis.Cluster.prototype | typeof Redis.prototype;
  static #instance: RedisServiceType;
  logger: ApiLoggingClassType;

  constructor(params: RedisConstructorType) {
    this.logger = ApiLoggingClass.instance;
    RedisService.#instance = this;

    if (params.isTest) {
      this.cacheHandle = new ioRedisMock();
      return;
    }

    if (params.isLocal) {
      const url = `${params.redis.url}:${params.redis.port}/0`;
      this.cacheHandle = new Redis(url, {
        keyPrefix: `${params.redis.prefix}${REDIS_DELIMITER}`
      });
      return;
    }

    const hosts = params.redis.url.split('|');
    console.log(`trying to connect to: Redis Cluster ${JSON.stringify(hosts)}`);
    this.cacheHandle = new Redis.Cluster(hosts, {
      redisOptions: {
        tls: {
          checkServerIdentity: () => undefined
        }
      },
      scaleReads: 'slave',
      keyPrefix: `${params.redis.prefix}${REDIS_DELIMITER}`
    });
  }

  public static get instance() {
    return this.#instance;
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
      const save = await this.cacheHandle.set(key, data);
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
      const save = await this.cacheHandle.set(key, data, expireOptions.token, expireOptions.time);
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
      const data = await this.cacheHandle.get(key);
      if (data) {
        return parseJson<TData>(data);
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
      const data = await this.cacheHandle.del(key);
      return isNumber(data);
    } catch (error) {
      this.logger.logError((error as Error).message, error);
      return false;
    }
  }

  public async getKeys() {
    return await this.cacheHandle.keys('*');
  }
}

export type RedisServiceType = typeof RedisService.prototype;
