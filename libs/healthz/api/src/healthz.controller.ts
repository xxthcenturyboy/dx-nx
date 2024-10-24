import { Request, Response } from 'express';
import process from 'process';

import { ApiLoggingClass } from '@dx/logger-api';
import { RedisHealthzService } from '@dx/data-access-redis';
import { PostgresDbConnection } from '@dx/data-access-postgres';
import { sendOK } from '@dx/utils-api-http-response';
import { STATUS_ERROR, STATUS_OK } from './healthz.const';
import {
  HealthzHttpType,
  HealthzMemoryType,
  HealthzPostgresType,
  HealthzRedisType,
  HealthzStatusType,
} from '@dx/healthz-shared';
import { HttpHealthzService } from './http-healthz.service';

const HttpHealth = {
  getHealth: async function (): Promise<HealthzHttpType> {
    const httpService = new HttpHealthzService();
    return {
      status: await httpService.healthCheck(),
    };
  },
};

const MemoryHealth = {
  getHealth: function (): HealthzMemoryType {
    const usage = process.memoryUsage();
    const status =
      usage.rss &&
      usage.heapTotal &&
      usage.heapUsed &&
      usage.external &&
      usage.arrayBuffers;

    return {
      status: status ? STATUS_OK : STATUS_ERROR,
      usage,
    };
  },
};

const PostgresHealth = {
  getHealth: async function (): Promise<HealthzPostgresType> {
    const dbh = PostgresDbConnection.dbHandle;
    try {
      dbh.authenticate();
      return {
        status: STATUS_OK,
        version: await dbh.databaseVersion(),
      };
    } catch (err) {
      ApiLoggingClass.instance.logError(err);
    }

    return {
      status: STATUS_ERROR,
      version: '',
    };
  },
};

const RedisHealth = {
  getHealth: async function (): Promise<HealthzRedisType> {
    const redisHealths = new RedisHealthzService();
    const result = await redisHealths.healthz();
    const status =
      result.ping && result.read && result.write ? STATUS_OK : STATUS_ERROR;
    return {
      status,
      profile: result,
    };
  },
};

export const HealthzController = {
  getHealth: async function (req: Request, res: Response) {
    const http = await HttpHealth.getHealth();
    const memory = MemoryHealth.getHealth();
    const redis = await RedisHealth.getHealth();
    const postgres = await PostgresHealth.getHealth();

    const apiStatus =
      http.status === STATUS_OK &&
      memory.status === STATUS_OK &&
      redis.status === STATUS_OK &&
      postgres.status === STATUS_OK
        ? STATUS_OK
        : STATUS_ERROR;

    const healthz: HealthzStatusType = {
      status: apiStatus,
      http,
      memory,
      redis,
      postgres,
    };

    sendOK(req, res, healthz);
  },
};

export type HealthzControllerType = typeof HealthzController;
