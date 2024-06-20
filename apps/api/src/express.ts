import express,
{
  Response,
  Express,
  Request
} from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { Logger as WinstonLogger } from 'winston';
import { logger as expressWinston } from 'express-winston';
import cookieParser from 'cookie-parser';
import morgan, { TokenIndexer } from 'morgan';
// import { StatusCodes } from 'http-status-codes';

import {
  RedisService,
  REDIS_DELIMITER
} from '@dx/redis';
import { HttpResponse } from '@dx/server';
import { ApiLoggingClass } from '@dx/logger';
import {
  API_ROOT,
  APP_PREFIX
} from 'libs/config/src/api/api-config.consts';
import { NextFunction } from 'express-serve-static-core';

export {
  expressConfig
};

type DxApiSettingsType = {
  DEBUG: boolean;
  SESSION_SECRET: string;
};

/////////////////////////////////////

function handleError(
  req: Request,
  res: Response,
  err: any,
  message: string,
  code?: number
) {
  if (code) {
    res.status(code);
  } else {
    res.status(400);
  }
  const logger = ApiLoggingClass.instance;
  const response = new HttpResponse;

  logger.logError(JSON.stringify(err), err);
  if (message) {
    return response.sendBadRequest(req, res, message);
  }

  if (
    typeof err === 'object'
    && err !== null
  ) {
    if (
      err.hasOwnProperty('code')
      && err.code === 'FORBIDDEN_CONTENT'
    ) {
      return response.sendBadRequest(req, res, err.message);
    }

    return response.sendBadRequest(req, res, err);
  }

  response.sendBadRequest(req, res, err.message || err);
}

async function expressConfig(
  app: Express,
  settings: DxApiSettingsType
) {
  /**
   * Support json & urlencoded requests.
   */
  app.use(express.json({ limit: '10mb', type: 'application/json' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  /**
   * Parse Cookies
   */
  app.use(cookieParser());
  app.use(morgan((tokens: TokenIndexer<Request, Response>, req: Request, res: Response) => [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    settings.DEBUG && `- user.id: ${req.session && req.session.userId || 'NONE'}`
  ].join(' ')

  ));

  /**
   * Session support
   * Must be before Rate Limiters for Express Middleware to have attached Session to req
   */
  const redisStore = new RedisStore({
    client: RedisService.instance,
    prefix: `session${REDIS_DELIMITER}`
  });
  app.use(session({
    name: `${APP_PREFIX}.sid`,
    secret: settings.SESSION_SECRET,
    store: redisStore,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: false, maxAge: undefined, sameSite: false }
  }));

  /**
   * Setup logging
   */
  if (!settings.DEBUG) {
    app.use(expressWinston({
      winstonInstance: new WinstonLogger()
    }));
  }

  /**
   * Serve files in the /public directory as static files.
   */
  app.use('/bundles', express.static(`${API_ROOT}/public/bundles`));
  app.use(express.static(`${API_ROOT}/public`));

  /**
   * Setup CSRF
   * any resource after this utilizes
   */
  // app.use(csurf);

  /**
   * Redirect HTTP to HTTPS (if enabled)
   */
  // if (settings.REDIRECT_HTTPS) {
  //   app.use('*', (req, res, next) => {
  //     if (req.protocol !== 'https') {
  //       return res.redirect(`https://${req.headers.host}${req.url}`);
  //     }
  //     return next();
  //   });
  // }

  /**
   * Check basic auth if enabled
   */
  // app.use('*', (req, res, next) => {
  //   // redirect www to non-www
  //   if (/^www\.advancedbasics\.com/.test(req.hostname)) {
  //     const next = `https://advancedbasics.com${req.originalUrl}`;

  //     return res.redirect(next);
  //   }

  //   if (settings.BASIC_AUTH) {
  //     const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  //     const [login, password] =
  //       new Buffer(b64auth, 'base64').toString().split(':');
  //     const [l, p] = settings.BASIC_AUTH.split(':');

  //     if (!login || !password || login !== l || password !== p) {
  //       res.set('WWW-Authenticate', 'Basic realm="web"');
  //       res.status(401).send('Authorization required.');
  //     } else {
  //       next();
  //     }
  //   } else {
  //     next();
  //   }
  // });

  /**
   * By default, serve our index.html file
   */
  // app.get('*', csurf, async (req, res) => {
  //   try {
  //     const csrfToken = (req as any).csrfToken();
  //     const preloadedState = await setPreloadedState(req, res, csrfToken);
  //     // Disable caching of index file
  //     res.setHeader('Surrogate-Control', 'no-store');
  //     res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  //     res.setHeader('Pragma', 'no-cache');
  //     res.setHeader('Expires', '0');
  //     res.status(StatusCodes.OK).send(renderToString(
  //       React.createElement(
  //         IndexRendered,
  //         {
  //           csrfToken,
  //           settings,
  //           preloadedState,
  //           path: req.path
  //         }
  //       )
  //     ));
  //   } catch (err) {
  //     Logger.error(err);
  //   }
  // });

  /**
   * Handle errors
   */
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => handleError(req, res, err, ''));

}
