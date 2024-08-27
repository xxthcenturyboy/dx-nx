import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';

import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger-api';
import { RedisService } from '@dx/data-access-redis';
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData
} from '@dx/data-access-socket-io-shared';
import { SocketApiConnectionConstructorType } from './socket-api.types';
import { webUrl } from '@dx/config-api';

export class SocketApiConnection {
  static #instance: SocketApiConnectionType;
  public io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;
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
      adapter: createAdapter(pubClient, subClient),
      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: false
      },
      cors: {
        credentials: true,
        origin: webUrl()
      },
      serveClient: false
    });
  }

  public static get instance() {
    return this.#instance;
  }
}

export type SocketApiConnectionType = typeof SocketApiConnection.prototype;
