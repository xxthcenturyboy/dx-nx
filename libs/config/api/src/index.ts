export {
  API_APP_NAME,
  API_ROOT,
  CRYPT_KEY,
  JWT_SECRET,
  OTP_SALT,
  POSTGRES_URI,
  SENDGRID_API_KEY,
  SENDGRID_URL,
} from './lib/api-config.consts';
export {
  getApiConfig,
  getRedisConfig
} from './lib/api-config';
export { ApiConfigType } from './lib/api-config.type';
export {
  apiUrl,
  getEnvironment,
  isDebug,
  isLocal,
  isProd,
  isTest,
  webDomain,
  webUrl
} from './lib/api-config.service';
