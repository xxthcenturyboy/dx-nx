import { convertpHyphensToUnderscores } from '@dx/util-strings';

export const USER_ENTITY_NAME = 'user';
export const USER_ENTITY_POSTGRES_DB_NAME =
  convertpHyphensToUnderscores(USER_ENTITY_NAME);

export const ACCOUNT_RESTRICTIONS = {
  ADMIN_LOCKOUT: 'ADMIN_LOCKOUT',
  LOGIN_ATTEMPTS: 'LOGIN_ATTEMPTS',
  OTP_LOCKOUT: 'OTP_LOCKOUT',
};

export const USER_SORT_FIELDS = ['firstName', 'lastName', 'optInBeta'];

export const USER_FIND_ATTRIBUTES = [
  'id',
  'firstName',
  'lastName',
  'fullName',
  'isAdmin',
  'isSuperAdmin',
  'optInBeta',
  'roles',
  'username',
  'restrictions',
];
