import { convertpHyphensToUnderscores } from '@dx/utils';

export const USER_PRIVILEGES_ENTITY_NAME = 'user-privileges';
export const USER_PRIVILEGES_POSTGRES_DB_NAME = convertpHyphensToUnderscores(USER_PRIVILEGES_ENTITY_NAME);