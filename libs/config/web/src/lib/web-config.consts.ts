import { APP_NAME } from '@dx/config-shared';

export const CLIENT_REDUX_DB_NAME = `${APP_NAME.replace(
  /\ /g,
  ''
).toLowerCase()}`;
