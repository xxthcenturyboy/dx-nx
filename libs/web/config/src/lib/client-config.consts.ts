import {
  APP_NAME,
  getEnvironment
} from '@dx/config-shared';

const env = getEnvironment();

export const CLIENT_HTTP_PROTOCOL = env.CLIENT_HTTP_PROTOCOL || 'http://';
export const CLIENT_APP_DOMAIN = env.CLIENT_DOMAIN || 'localhost';
export const CLIENT_APP_URL = `${CLIENT_HTTP_PROTOCOL}${CLIENT_APP_DOMAIN}`;
export const CLIENT_APP_URL_PORT = `${CLIENT_APP_URL}:${
  env.CLIENT_PORT || 3000
}`;
export const CLIENT_REDUX_DB_NAME = `${APP_NAME.replace(
  /\ /g,
  ''
).toLowerCase()}`;
