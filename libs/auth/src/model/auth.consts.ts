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

export const AUTH_ROUTES_V1_RATE_LIMIT = [
  'api/v1/auth/login',
  'api/v1/auth/lookup',
  'api/v1/auth/otp-code/send/email',
  'api/v1/auth/otp-code/send/phone',
  'api/v1/auth/refresh-token',
  'api/v1/auth/validate/email',
];
