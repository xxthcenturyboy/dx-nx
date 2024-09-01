export {
  API_APP_NAME,
  API_ROOT,
  CRYPT_KEY,
  JWT_SECRET,
  OTP_SALT,
  POSTGRES_URI,
  S3_ACCESS_KEY_ID,
  S3_APP_BUCKET_NAME,
  S3_SECRET_ACCESS_KEY,
  SENDGRID_API_KEY,
  SENDGRID_URL,
  UPLOAD_MAX_FILE_SIZE,
} from './lib/api-config.consts';
export {
  getApiConfig,
  getRedisConfig
} from './lib/api-config';
export { ApiConfigType } from './lib/api-config.type';
export {
  getEnvironment,
  isDebug,
  isLocal,
  isProd,
  isTest,
  webDomain,
  webUrl
} from './lib/api-config.service';
