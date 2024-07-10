import { ApiLoggingClass, ApiLoggingClassType } from '@dx/logger-api';
import { ShortLinkModel } from './shortlink.postgres-model';

export class ShortlinkService {
  logger: ApiLoggingClassType;

  constructor() {
    this.logger = ApiLoggingClass.instance;
  }

  public async getShortlinkTarget(id: string) {
    try {
      const path = await ShortLinkModel.getShortLinkTarget(id);
      if (path) {
        return path;
      }
    } catch (err) {
      const message = err.message;
      this.logger.logError(message);
    }

    return null;
  }
}

export type ShortlinkServiceType = typeof ShortlinkService.prototype;
