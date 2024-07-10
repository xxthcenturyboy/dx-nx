import express, { Express as IExpress } from 'express';
import cors from 'cors';
import { Express } from 'jest-express/lib/express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
// import session from 'express-session';

import { configureExpress } from './express';
import { ApiLoggingClass } from '@dx/logger-api';
import { RedisService } from '@dx/data-access-redis';
import { handleError } from '@dx/utils-api-error-handler';

let app: IExpress;

jest.mock('connect-redis');
jest.mock('@dx/logger');
jest.mock('@dx/redis');
jest.mock('@dx/api-error-handler');

describe('configureExpress', () => {
  const logInfoSpy = jest.spyOn(ApiLoggingClass.prototype, 'logInfo');

  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
    new RedisService({
      isLocal: true,
      redis: {
        port: 6379,
        prefix: 'app',
        url: 'redis://redis',
      },
    });
    app = new Express() as unknown as IExpress;
  });

  // beforeEach(() => {
  //   app = new Express() as unknown as IExpress;
  // });

  it('should exist', () => {
    // arrange
    // act
    // assert
    expect(configureExpress).toBeDefined();
  });

  test('should configure express when invoked', async () => {
    // arrange
    await configureExpress(app, { DEBUG: true, SESSION_SECRET: 'test-secret' });
    // act
    // @ts-expect-error -ok
    expect(JSON.stringify(app.use.mock.calls)).toEqual(
      JSON.stringify([
        [
          cors({
            origin: '',
            credentials: true,
          }),
        ],
        [express.json({ limit: '10mb', type: 'application/json' })],
        [express.urlencoded({ extended: true, limit: '10mb' })],
        [cookieParser()],
        [morgan(() => 'string')],
        // [session({
        //   resave: false,
        //   saveUninitialized: false,
        //   secret: 'test-secret'
        // })],
        [() => handleError],
      ])
    );
    // assert
    expect(app.use).toHaveBeenCalledTimes(6);
  });
});
