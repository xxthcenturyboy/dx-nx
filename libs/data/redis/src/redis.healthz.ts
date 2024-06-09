import { RedisService } from './redis.service';

import { ApiConfigType } from '@dx/config';
import { parseJson } from '@dx/utils';

export class RedisHealthzService extends RedisService {
  testKey = 'test';
  testData = { test: true };

  constructor(params: ApiConfigType) {
    super(params);
  }

  private async testConnection() {
    const response = await this.cache.ping();
    this.logger.logInfo(`Redis PING: ${response}`);
    return response === 'PONG';
  }

  private async testWrite() {
    return await this.setCacheItem(this.testKey, JSON.stringify(this.testData));
  }

  private async testRead() {
    const result = await this.getCacheItem<string>(this.testKey);
    if (result) {
      return parseJson<typeof this.testData>(result) as typeof this.testData;
    }

    return null;
  }

  public async testReadAndWrite() {
    const write = await this.testWrite();
    this.logger.logInfo(`write result: ${write ? 'OK' : ''}`);

    if (write) {
      const read = await this.testRead();
      this.logger.logInfo(`read result: ${JSON.stringify(read || {})}`);
      return !!read;
    }

    return false;
  }

  public async healthCheck() {
    this.logger.logInfo('***************************************');
    this.logger.logInfo('Checking connection to Redis');
    const connection = await this.testConnection();
    if (connection) {
      const readAndWrite = await this.testReadAndWrite();
      if (readAndWrite) {
        this.logger.logInfo('Redis Connection Healthy');
        this.logger.logInfo('***************************************');
        this.logger.logInfo(' ');
        return true;
      }
    }

    this.logger.logError('Redis Connection NOT ESTABLISHED');
    this.logger.logInfo('***************************************');
    this.logger.logInfo(' ');
    return false;
  }
}

export type RedisHealthzServiceType = typeof RedisHealthzService.prototype;
