import { S3Service } from '@dx/data-access-s3';
import { ApiLoggingClass } from '@dx/logger-api';
import { S3_BUCKETS } from '@dx/media-shared';
import { S3_APP_BUCKET_NAME } from '@dx/config-api';

export class DxS3Class {
  public static async initializeS3() {
    const logger = ApiLoggingClass.instance;

    try {
      const service = new S3Service();
      if (!service) {
        logger.logError('S3 Service did not instantiate correctly. S3 unavailable');
        return false;
      }

      await service.instantiate(S3_APP_BUCKET_NAME, Object.values(S3_BUCKETS));
      logger.logInfo('S3 Connected successfully');
      return true;
    } catch (err) {
      logger.logError((err as Error).message, err);
      return false;
    }
  }
}
