import { convertpHyphensToUnderscores } from '@dx/utils';

export const USER_EMAIL_ENTITY_NAME = 'user-email';
export const USER_EMAIL_POSTGRES_DB_NAME = convertpHyphensToUnderscores(USER_EMAIL_ENTITY_NAME);
export const USER_EMAIL_LABEL = {
  DEFAULT: 'Default',
  MAIN: 'Main'
}
