import { ApiLoggingClass } from '@dx/logger-api';
import {
  RedisHealthzService,
  RedisService,
  RedisServiceType,
} from '@dx/data-access-redis';
import { getRedisConfig } from '@dx/config-api';
import { isLocal } from '@dx/config-api';

export class DxRedisCache {
  public static async getRedisConnection(): Promise<RedisServiceType | null> {
    const logger = ApiLoggingClass.instance;
    const redisConfig = getRedisConfig();

    try {
      new RedisService({
        isLocal: isLocal(),
        redis: redisConfig,
      });

      const healthz = new RedisHealthzService();

      await healthz.healthCheck();

      return RedisService.instance;
    } catch (err) {
      logger.logError((err as Error).message, err);
      return null;
    }
  }
}
