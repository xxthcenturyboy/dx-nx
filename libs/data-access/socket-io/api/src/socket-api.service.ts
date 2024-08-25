
import { parseJson } from '@dx/utils-shared-misc';
import { isNumber } from '@dx/util-numbers';
import { isTest } from '@dx/config-api';
import {
  REDIS_DELIMITER,
  RedisConstructorType,
  RedisExpireOptions
} from '@dx/data-access-redis';
import { SocketApiConnection } from './socket-api.connection';
import { SocketApiServiceConstructorType } from './socket-api.types';

export class SocketApiService extends SocketApiConnection {
  constructor(params: SocketApiServiceConstructorType) {
    super(params);
  }

  public setup() {

  }
}

export type SocketApiServiceType = typeof SocketApiService.prototype;
