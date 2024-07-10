import { Redis } from 'ioredis';
import ioRedisMock from 'ioredis-mock';

import { ApiLoggingClass, ApiLoggingClassType } from '@dx/logger-api';
import { parseJson } from '@dx/utils-shared-misc';
import { isNumber } from '@dx/util-numbers';
import { getRedisConfig } from '@dx/config-api';
import { isTest } from '@dx/config-shared';
import { REDIS_DELIMITER } from './redis.consts';
import { RedisConstructorType, RedisExpireOptions } from './redis.types';

export class RedisService {
  cacheHandle: typeof Redis.Cluster.prototype | typeof Redis.prototype;
  static #instance: RedisServiceType;
  logger: ApiLoggingClassType;

  constructor(params: RedisConstructorType) {
    this.logger = ApiLoggingClass.instance;
    RedisService.#instance = this;

    if (isTest()) {
      this.cacheHandle = new ioRedisMock();
      return;
    }

    if (params.isLocal) {
      const url = `${params.redis.url}:${params.redis.port}/0`;
      this.cacheHandle = new Redis(url, {
        keyPrefix: `${params.redis.prefix}${REDIS_DELIMITER}`,
      });
      return;
    }

    const hosts = params.redis.url.split('|');
    console.log(`trying to connect to: Redis Cluster ${JSON.stringify(hosts)}`);
    this.cacheHandle = new Redis.Cluster(hosts, {
      redisOptions: {
        tls: {
          checkServerIdentity: () => undefined,
        },
      },
      scaleReads: 'slave',
      keyPrefix: `${params.redis.prefix}${REDIS_DELIMITER}`,
    });
  }

  public static get instance() {
    return this.#instance;
  }

  public async setCacheItem(key: string, data: string) {
    if (!key && !data) {
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
    if (!key && !data) {
      return false;
    }

    try {
      // @ts-expect-error - types are ok here
      const save = await this.cacheHandle.set(
        key,
        data,
        expireOptions.token,
        expireOptions.time
      );
      return save === 'OK';
    } catch (error) {
      this.logger.logError((error as Error).message, error);
      return false;
    }
  }

  public async getCacheItemSimple(key: string) {
    if (!key) {
      return null;
    }

    try {
      return await this.cacheHandle.get(key);
    } catch (error) {
      this.logger.logError((error as Error).message, error);
      return null;
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

  public async getAllNamespace<TData>(namespace: string): Promise<TData[]> {
    if (!namespace) {
      return null;
    }
    const result: TData[] = [];

    try {
      const keys = await this.getKeys(namespace);

      if (Array.isArray(keys)) {
        const prefix = getRedisConfig().prefix;
        for (const key of keys) {
          const trimmedKey = key.replace(`${prefix}:`, '');
          result.push(await this.getCacheItem(trimmedKey));
        }
      }

      return result;
    } catch (error) {
      this.logger.logError((error as Error).message, error);
      return result;
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

  public async getKeys(namespace?: string) {
    if (namespace) {
      return await this.cacheHandle.keys(`${namespace}*`);
    }
    return await this.cacheHandle.keys('*');
  }
}

export type RedisServiceType = typeof RedisService.prototype;
