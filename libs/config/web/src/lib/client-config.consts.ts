import { APP_NAME } from '@dx/config-shared';
// import { AUTH_ROUTES } from '@dx/auth-web';

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
