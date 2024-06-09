import { ApiLoggingClassType } from '@dx/logger';
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
  public static async getRedisConnection(logger: ApiLoggingClassType): Promise<RedisServiceType | null> {
    const redisConfig = getRedisConfig();

    try {
      const redisService = new RedisService({
        isLocal: isLocal(),
        logger: logger,
        redis: redisConfig
      });

      const healthz = new RedisHealthzService({
        logger,
        cacheService: redisService
      });

      await healthz.healthCheck();

      return redisService;
    } catch (err) {
      logger.logError((err as Error).message, err);
      return null
    }
  }
}
