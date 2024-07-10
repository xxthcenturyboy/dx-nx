import { convertpHyphensToUnderscores } from '@dx/util-strings';

export const USER_ROLE = {
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  USER: 'USER',
};

export const USER_ROLE_ARRAY = Object.values(USER_ROLE);

// User Privilege
export const USER_PRIVILEGES_ENTITY_NAME = 'user-privileges';
export const USER_PRIVILEGES_POSTGRES_DB_NAME = convertpHyphensToUnderscores(
  USER_PRIVILEGES_ENTITY_NAME
);
