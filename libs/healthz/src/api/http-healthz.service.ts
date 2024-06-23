import { StatusCodes } from "http-status-codes";

import { ApiLoggingClass } from "@dx/logger";
import {
  STATUS_ERROR,
  STATUS_OK
} from "../model/healthz.const";

export class HttpHealthzService {
  private async ping(url?: string) {
    try {
      const result = await fetch(url || 'https://google.com');
      if (
        result
        && result.status === StatusCodes.OK
      ) {
        return STATUS_OK;
      }

      return STATUS_ERROR;
    } catch (err) {
      ApiLoggingClass.instance.logError(err);
      return (err as Error).message;
    }
  }

  public async healthCheck(url?: string): Promise<string | number> {
    return this.ping(url);
  }
}

export type HttpHealthzServiceType = typeof HttpHealthzService.prototype;
