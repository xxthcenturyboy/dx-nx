import {
  APP_NAME,
  CLIENT_APP_URL,
  getEnvironment
} from '@dx/config-shared';
// import { AUTH_ROUTES } from '@dx/auth-web';

const env = getEnvironment();

export const CLIENT_APP_URL_PORT = `${CLIENT_APP_URL}:${
  env.CLIENT_PORT || 3000
}`;
export const CLIENT_REDUX_DB_NAME = `${APP_NAME.replace(
  /\ /g,
  ''
).toLowerCase()}`;

export const WEB_ROUTES = {
  MAIN: '/',
  AUTH: '/',
  LOGIN: '/login',
  SHORTLINK: null,
  USER_PROFILE: null,
  ADMIN: {
  },
  SUDO: {
  }
}
