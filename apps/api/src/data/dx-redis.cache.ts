import { ApiLoggingClass } from '@dx/logger';
import {
  RedisHealthzService,
  RedisService,
  RedisServiceType
} from '@dx/redis';
import {
  isLocal,
  getRedisConfig
} from '@dx/config';

export class DxRedisCache {
  public static async getRedisConnection(): Promise<RedisServiceType | null> {
    const logger = ApiLoggingClass.instance;
    const redisConfig = getRedisConfig();

    try {
      new RedisService({
        isLocal: isLocal(),
        redis: redisConfig
      });

      const healthz = new RedisHealthzService();

      await healthz.healthCheck();

      return RedisService.instance;
    } catch (err) {
      logger.logError((err as Error).message, err);
      return null
    }
  }
}
