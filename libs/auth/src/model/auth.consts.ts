import { APP_PREFIX } from "@dx/config";

export const AUTH_ENTITY_NAME = 'auth';

export const AUTH_TOKEN_NAMES = {
  AUTH: 'token',
  EXP: 'exp',
  REFRESH:  'jwt',
  ACCTSECURE: `${APP_PREFIX}-accts`
};

export const USER_LOOKUPS = {
  EMAIL: 'email',
  PHONE: 'phone'
};

export const CLIENT_ROUTE = {
  INVITE: 'invite',
  OTP_LOCK: 'otp-lock',
  RESET: 'reset',
  VALIDATE_EMAIL: 'validate-email'
};
