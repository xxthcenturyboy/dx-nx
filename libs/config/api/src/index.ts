export {
  API_APP_NAME,
  API_HOST,
  API_PORT,
  API_ROOT,
  CRYPT_KEY,
  JWT_SECRET,
  OTP_SALT,
  POSTGRES_URI,
  SENDGRID_API_KEY,
  SENDGRID_URL,
} from './lib/api-config.consts';
export { getApiConfig, getRedisConfig } from './lib/api-config';
export { ApiConfigType } from './lib/api-config.type';
