import {
  NextFunction,
  Request,
  Response
} from 'express';
import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';

import {
  RedisService,
  REDIS_DELIMITER
} from '@dx/redis';
import {
  RATE_LIMIT_MESSAGE,
  RATE_LIMITS
} from '../model/server.const';
import { AUTH_ROUTES_V1_RATE_LIMIT } from '@dx/auth';
import {
  sendOK,
  sendTooManyRequests
} from './http-responses';
import { APP_PREFIX } from '@dx/config';

export class DxRateLimiters {
  static handleLimitCommon(
    req: Request,
    res: Response,
    next: NextFunction,
    options: { message: string }
  ) {
    const url = req.originalUrl;
    if (AUTH_ROUTES_V1_RATE_LIMIT.indexOf(url) > -1) {
      const message = options.message || RATE_LIMIT_MESSAGE;
      return sendOK(req, res, { error: message });
    }

    sendTooManyRequests(req, res, RATE_LIMIT_MESSAGE);
  }

  static handleLimitLogin(
    req: Request,
    res: Response,
    next: NextFunction,
    options: { message: string }
  ) {
    // TODO: Handle lock out of account
    // Send email / SMS depending upon type, etc
    // Don't handle in this file
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({ error: 'Your account has been locked. Check your email for instructions.' }));
  }

  static keyGenStandard(req: Request) {
    if (
      req.session
      && req.session.userId
    ) {
      return req.session.userId;
    }

    return req.ip;
  }

  static keyGenLogin(req: Request) {
    if (
      req.body
      && req.body.value
    ) {
      return req.body.value;
    }

    if (
      req.body
      && req.body.device
      && req.body.device.uniqueDeviceId
    ) {
      const { uniqueDeviceId } = req.body.device;
      return uniqueDeviceId;
    }

    return req.ip;
  }

  public static authLookup() {
    return rateLimit({
      store: new RedisStore({
        prefix: `${APP_PREFIX}${REDIS_DELIMITER}auth-lookup-rl${REDIS_DELIMITER}`,
        // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
        sendCommand: (...args: string[]) => RedisService.instance.cacheHandle.call(...args),
      }),
      handler: DxRateLimiters.handleLimitCommon,
      keyGenerator: DxRateLimiters.keyGenLogin,
      limit: RATE_LIMITS.AUTH_LOOKUP, // limit each IP to 20 requests
      message: 'This insanity has been stopped. Quit tryna hack us.',
      standardHeaders: true,
      windowMs: 1000 * 60 * 3 // 3 minutes
    })
  }

  public static login() {
    return rateLimit({
      store: new RedisStore({
        prefix: `${APP_PREFIX}${REDIS_DELIMITER}login-rl${REDIS_DELIMITER}`,
        // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
        sendCommand: (...args: string[]) => RedisService.instance.cacheHandle.call(...args),
      }),
      handler: DxRateLimiters.handleLimitLogin,
      keyGenerator: DxRateLimiters.keyGenLogin,
      limit: RATE_LIMITS.LOGIN, // limit each IP to 15 requests
      standardHeaders: true,
      windowMs: 1000 * 60 * 60 // 60 minutes
    });
  }

  public static standard() {
    return rateLimit({
      store: new RedisStore({
        prefix: `${APP_PREFIX}${REDIS_DELIMITER}rl${REDIS_DELIMITER}`,
        // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
        sendCommand: (...args: string[]) => RedisService.instance.cacheHandle.call(...args),
      }),
      handler: DxRateLimiters.handleLimitCommon,
      keyGenerator: DxRateLimiters.keyGenStandard,
      limit: RATE_LIMITS.STD, // limit each IP to 500 requests
      skip: (req: Request, res: Response) => {
        const url = req.originalUrl;
        return AUTH_ROUTES_V1_RATE_LIMIT.indexOf(url) > -1;
      },
      standardHeaders: true,
      windowMs: 0 // disable delaying - full speed until the max limit is reached
    });
  }

  public static strict() {
    return rateLimit({
      store: new RedisStore({
        prefix: `${APP_PREFIX}${REDIS_DELIMITER}strict-rl${REDIS_DELIMITER}`,
        // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
        sendCommand: (...args: string[]) => RedisService.instance.cacheHandle.call(...args),
      }),
      handler: DxRateLimiters.handleLimitCommon,
      keyGenerator: DxRateLimiters.keyGenStandard,
      limit: RATE_LIMITS.STRICT, // limit each IP to 100 requests
      skip: (req: Request, res: Response) => {
        const url = req.originalUrl;
        return AUTH_ROUTES_V1_RATE_LIMIT.indexOf(url) > -1;
      },
      standardHeaders: true,
      windowMs: 1000 * 60 * 3 // 3 minutes
    })
  }

  public static veryStrict() {
    return rateLimit({
      store: new RedisStore({
        prefix: `${APP_PREFIX}${REDIS_DELIMITER}very-strict-rl${REDIS_DELIMITER}`,
        // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
        sendCommand: (...args: string[]) => RedisService.instance.cacheHandle.call(...args),
      }),
      handler: DxRateLimiters.handleLimitCommon,
      keyGenerator: DxRateLimiters.keyGenStandard,
      limit: RATE_LIMITS.VERY_STRICT, // limit each IP to 3 requests per windowMs
      skip: (req: Request, res: Response) => {
        const url = req.originalUrl;
        return AUTH_ROUTES_V1_RATE_LIMIT.indexOf(url) > -1;
      },
      standardHeaders: true,
      windowMs: 1000 * 60 * 10, // 10 minutes
    })
  }
}
