export const API_ERROR = 'Could not complete the request.';
export const APP_DESCRIPTION = 'Boiler plate nx monorepo: Node, Express, React, Expo, Postgres, Redis';
export const APP_DOMAIN = 'danex.software';
export const APP_NAME = 'DX';
export const APP_PREFIX = 'dx';

export const HTTP_PROTOCOL = {
  DEV: 'http://',
  PROD: 'https://',
  STAGING: 'https://'
};

export const API_URL = {
  DEV: `0.0.0.0`,
  PROD: `${HTTP_PROTOCOL.PROD}${APP_DOMAIN}`,
  STAGING: `${HTTP_PROTOCOL.STAGING}${APP_DOMAIN}`
};

export const API_HOST_PORT = {
  DEV: 4000,
  PROD: 4200,
  STAGING: 4200
};

export const WEB_DOMAIN = {
  DEV: 'localhost',
  PROD: APP_DOMAIN,
  STAGING: APP_DOMAIN
};

export const WEB_URL = {
  DEV: `${HTTP_PROTOCOL.DEV}${WEB_DOMAIN.DEV}`,
  PROD: `${HTTP_PROTOCOL.PROD}${WEB_DOMAIN.PROD}`,
  STAGING: `${HTTP_PROTOCOL.STAGING}${WEB_DOMAIN.STAGING}`
};

export const COMPANY_NAME = 'Danex Software';
export const DEFAULT_LIMIT = 10;
export const DEFAULT_OFFSET = 0;
export const DEFAULT_SORT = 'ASC';
export const ERROR_MSG = 'Oops! Something went wrong. It\'s probably nothing you did and most likely our fault. There may be additional info for this message.';
export const ERROR_MSG_API = 'Oops! Something went wrong. It\'s probably nothing you did and most likely our fault. If it happens many times, please contact support.';
export const LOCAL_ENV_NAME = 'development';
export const LOREM =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";
export const PHONE_DEFAULT_REGION_CODE = 'US';
export const PROD_ENV_NAME = 'production';
export const STAGING_ENV_NAME = 'production';
