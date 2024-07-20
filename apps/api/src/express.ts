import express,
{
  Response,
  Express,
  Request,
  // NextFunction
} from 'express';
// import session from 'express-session';
// import RedisStore from 'connect-redis';
import { Logger as WinstonLogger } from 'winston';
import { logger as expressWinston } from 'express-winston';
import cookieParser from 'cookie-parser';
import morgan,
{
  TokenIndexer
} from 'morgan';
import cors from 'cors';

// import { DxDateUtilClass } from '@dx/util-dates';
import { CLIENT_APP_URL } from '@dx/config-shared';
// import { StatusCodes } from 'http-status-codes';

// import { RedisService, REDIS_DELIMITER } from '@dx/redis';
// import {
  // API_ROOT,
  // APP_PREFIX
// } from '@dx/config-shared';
// import { isLocal } from '@dx/config-shared';

import { handleError } from '@dx/utils-api-error-handler';

type DxApiSettingsType = {
  DEBUG: boolean;
  SESSION_SECRET: string;
};

export async function configureExpress(
  app: Express,
  settings: DxApiSettingsType
) {
  app.use(
    cors({
      origin: CLIENT_APP_URL,
      credentials: true,
    })
  );
  // Support json & urlencoded requests.
  app.use(express.json({ limit: '10mb', type: 'application/json' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Parse Cookies
  app.use(cookieParser());

  // Log HTTP requests
  app.use(
    morgan(
      (tokens: TokenIndexer<Request, Response>, req: Request, res: Response) =>
        [
          tokens.method(req, res),
          tokens.url(req, res),
          tokens.status(req, res),
          tokens.res(req, res, 'content-length'),
          '-',
          tokens['response-time'](req, res),
          'ms',
          settings.DEBUG && `- user.id: ${req.user?.id || 'NONE'}`,
        ].join(' ')
    )
  );

  // Session support
  // Must be before Rate Limiters for Express Middleware to have attached Session to req
  // const redisStore = new RedisStore({
  //   client: RedisService.instance.cacheHandle,
  //   prefix: `session${REDIS_DELIMITER}`
  // });
  // app.use(session({
  //   name: `${APP_PREFIX}.sid`,
  //   secret: settings.SESSION_SECRET,
  //   store: redisStore,
  //   resave: false,
  //   saveUninitialized: true,
  //   cookie: {
  //     httpOnly: true,
  //     secure: false,
  //     maxAge: isLocal()
  //       ? DxDateUtilClass.getMilisecondsDays(1)
  //       : DxDateUtilClass.getMilisecondsDays(30),
  //     sameSite: false
  //   }
  // }));

  // Setup logging
  if (!settings.DEBUG) {
    app.use(
      expressWinston({
        winstonInstance: new WinstonLogger(),
      })
    );
  }

  // Serve files in the /public directory as static files.
  // app.use('/bundles', express.static(`${API_ROOT}/dist/bundles`));
  // app.use(express.static(`${API_ROOT}/dist`));

  // Setup CSRF
  // any resource after this utilizes
  // app.use(csurf);

  // Redirect HTTP to HTTPS (if enabled)
  // if (settings.REDIRECT_HTTPS) {
  //   app.use('*', (req, res, next) => {
  //     if (req.protocol !== 'https') {
  //       return res.redirect(`https://${req.headers.host}${req.url}`);
  //     }
  //     return next();
  //   });
  // }

  // Check basic auth if enabled
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

  // By default, serve our index.html file
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

  app.use((err: Error, req: Request, res: Response) =>
    handleError(req, res, err, '')
  );
}
