import { Express as IExpress} from 'express';
import { Express } from 'jest-express/lib/express';

import { configureExpress } from './express';
import { ApiLoggingClass } from '@dx/logger';
import { RedisService } from '@dx/redis';

let app: IExpress;

jest.mock('connect-redis')
jest.mock('@dx/logger');
jest.mock('@dx/redis');
jest.mock('@dx/server');

describe('configureExpress', () => {
  const logInfoSpy = jest.spyOn(ApiLoggingClass.prototype, 'logInfo');

  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
    new RedisService({
      isLocal: true,
      redis: {
        port: 6379,
        prefix: 'app',
        url: 'redis://redis'
      }
    })
  });

  beforeEach(() => {
    app = new Express() as unknown as IExpress;
  })

  it('should exist', () => {
    // arrange
    // act
    // assert
    expect(configureExpress).toBeDefined();
  });

  test('should configure express when invoked', async () => {
    // arrange
    // act
    await configureExpress(app, { DEBUG: true, SESSION_SECRET: 'test-secret' });
    // assert
    expect(app.use).toHaveBeenCalledTimes(6);
  });
});
