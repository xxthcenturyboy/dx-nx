import { APP_NAME } from '@dx/config-shared';
import { AUTH_ROUTES } from '@dx/auth-web';
import { DASHBOARD_ROUTES } from '@dx/dashboard-web';
import {
  USER_PROFILE_ROUTES,
  USER_ROUTES
} from '@dx/user-web';
import { SHORTLINK_ROUTES } from '@dx/shortlink-web';

export const CLIENT_REDUX_DB_NAME = `${APP_NAME.replace(
  /\ /g,
  ''
).toLowerCase()}`;

export const WEB_ROUTES = {
  MAIN: '/',
  AUTH: AUTH_ROUTES,
  DASHBOARD: DASHBOARD_ROUTES,
  SHORTLINK: SHORTLINK_ROUTES,
  USER_PROFILE: USER_PROFILE_ROUTES,
  ADMIN: {
    USER: USER_ROUTES
  },
  SUDO: {
  }
}
