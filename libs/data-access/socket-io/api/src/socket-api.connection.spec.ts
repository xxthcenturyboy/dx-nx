import {
  createServer,
  Server as HttpServer
} from 'node:http';
import { type AddressInfo } from 'node:net';
import {
  io as ioc,
  type Socket as ClientSocket
} from 'socket.io-client';
import { type Socket as ServerSocket } from 'socket.io';

import { SocketApiConnection } from './socket-api.connection';
import { ApiLoggingClass } from '@dx/logger-api';
import { getRedisConfig } from '@dx/config-api';
import { RedisService } from '@dx/data-access-redis';

jest.mock('@dx/logger-api');

function waitFor(socket: ServerSocket | ClientSocket, event: string) {
  return new Promise((resolve) => {
    socket.once(event, resolve);
  });
}

describe('SocektApiConnection', () => {
  let serverSocket: ServerSocket;
  let clientSocket: ClientSocket;
  let httpServer: HttpServer;

  beforeAll((done) => {
    new ApiLoggingClass({ appName: 'Unit Testing' });
    httpServer = createServer();
    const redisConfig = getRedisConfig();
    new RedisService({
      isLocal: true,
      redis: redisConfig,
    });

    new SocketApiConnection({ httpServer });
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = ioc(`http://localhost:${port}`);
      SocketApiConnection.instance.io.on('connection', (socket) => {
        serverSocket = socket;
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll(() => {
    SocketApiConnection.instance.io.close();
    clientSocket.disconnect();
  });

  it('should be defined upon import', () => {
    expect(SocketApiConnection).toBeDefined();
  });

  it('should work when hello emitted.', async () => {
    clientSocket.on('hello', (arg) => {
      expect(arg).toBe('world');
    });
    serverSocket.emit('hello', 'world');
  });

  it('should work with an acknowledgement', (done) => {
    serverSocket.on('hi', (cb) => {
      cb('hola');
    });
    clientSocket.emit('hi', (arg) => {
      expect(arg).toBe('hola');
      done();
    });
  });

  it('should work with emitWithAck()', async () => {
    serverSocket.on('foo', (cb) => {
      cb('bar');
    });
    const result = await clientSocket.emitWithAck('foo');
    expect(result).toBe('bar');
  });

  it('should work with waitFor()', () => {
    clientSocket.emit('baz');

    return waitFor(serverSocket, 'baz');
  });
});
