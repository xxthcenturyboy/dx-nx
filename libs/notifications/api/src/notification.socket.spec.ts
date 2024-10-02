import {
  createServer,
  Server as HttpServer
} from 'node:http';

import { getRedisConfig } from '@dx/config-api';
import { RedisService } from '@dx/data-access-redis';
import { ApiLoggingClass } from '@dx/logger-api';
import { SocketApiConnection } from '@dx/data-access-socket-io-api';
import { NotificationSocketApiService } from './notification.socket';

jest.mock('@dx/logger-api');

describe('NotificationSocketApiService', () => {
  beforeAll(() => {
    new ApiLoggingClass({ appName: 'TEST' });
    const redisConfig = getRedisConfig();
    new RedisService({
      isLocal: true,
      redis: redisConfig,
    });
    const httpServer = createServer();
    new SocketApiConnection({ httpServer });
  });

  afterAll(() => {
    SocketApiConnection.instance.io.close();
  });

  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(NotificationSocketApiService).toBeDefined();
  });

  it('should exist when instantiated', () => {
    // arrange
    // act
    new NotificationSocketApiService();
    // assert
    expect(NotificationSocketApiService.instance).toBeDefined();
  });

  it('should have all methods', () => {
    // arrange
    // act
    new NotificationSocketApiService();
    // assert
    expect(NotificationSocketApiService.instance.ns).toBeDefined();
    expect(NotificationSocketApiService.instance.socket).toBeDefined();
    expect(NotificationSocketApiService.instance.configureNamespace).toBeDefined();
    expect(NotificationSocketApiService.instance.sendAppUpdateNotification).toBeDefined();
    expect(NotificationSocketApiService.instance.sendNotificationToAll).toBeDefined();
    expect(NotificationSocketApiService.instance.sendNotificationToUser).toBeDefined();
  });
});
