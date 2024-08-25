import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';

import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger-api';
import { RedisService } from '@dx/data-access-redis';
import { SocketApiConnectionConstructorType } from './socket-api.types';

export class SocketApiConnection {
  static #instance: SocketApiConnectionType;
  public io: typeof Server.prototype;
  private logger: ApiLoggingClassType;

  constructor(params: SocketApiConnectionConstructorType) {
    this.logger = ApiLoggingClass.instance;
    if (!params.httpServer) {
      this.logger.logError('Missing params in SocketApiConnection: Could not create sockets');
      return;
    }
    if (!RedisService.instance.cacheHandle) {
      this.logger.logError('Redis instance unavailable in SocketApiConnection: Could not create sockets');
      return;
    }

    SocketApiConnection.#instance = this;
    const pubClient = RedisService.instance.cacheHandle.duplicate();
    const subClient = RedisService.instance.cacheHandle.duplicate();

    this.io = new Server(params.httpServer, {
      adapter: createAdapter(pubClient, subClient)
    });
  }

  public static get instance() {
    return this.#instance;
  }
}

export type SocketApiConnectionType = typeof SocketApiConnection.prototype;


maybe
  sockets connections file
    imports all socket connections by library
      each connection accepts the main connection as args
  make all connection files in respective libs and import into above
maybe I don't mean connections, but namespaces - somethign like that
