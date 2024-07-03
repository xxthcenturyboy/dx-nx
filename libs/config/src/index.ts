export {
  getApiConfig,
  getRedisConfig
} from './api/api-config';
export {
  API_APP_NAME,
  API_ROOT,
  APP_PREFIX,
  CRYPT_KEY,
  JWT_SECRET,
  OTP_SALT,
  POSTGRES_URI,
  SENDGRID_API_KEY,
  SENDGRID_URL
} from './api/api-config.consts';
export { ApiConfigType } from './api/api-config.type';
export {
  APP_DOMAIN,
  COMPANY_NAME,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  DEFAULT_SORT,
  SORT_DIR
} from './common/common-config.consts';
export { CUSTOM_PROFANE_WORDS } from './common/custom-profate-words.const';
export { DISPOSABLE_EMAIL_DOMAINS } from './common/disposable-email-providers';
export { INVALID_EMAIL_NAMES } from './common/email-validation.const';
export {
  isDebug,
  isLocal,
  isProd,
  isTest
} from './common/common-config.service';

// Client
export {
  CLIENT_APP_DOMAIN,
  CLIENT_APP_URL
} from './client/client-config.consts';

// Mobile
export {
  APPLE_APP_ID,
  APPLE_WEB_CREDENTIALS,
  PACKAGE_NAME,
  SHA256_CERT_FINGERPRINT
} from './mobile/mobile-config.const';
export {
  AndroiodWellKnownData,
  AppleWellKnownData
} from './mobile/mobile-config.type';

// Test Data
export {
  TEST_COUNTRY_CODE,
  TEST_EMAIL,
  TEST_EXISTING_EMAIL,
  TEST_EXISTING_PASSWORD,
  TEST_EXISTING_PHONE,
  TEST_EXISTING_USER_ID,
  TEST_EXISTING_USER_PRIVILEGE_ID,
  TEST_FIRST_NAME,
  TEST_LAST_NAME,
  TEST_PASSWORD,
  TEST_PHONE,
  TEST_PHONE_IT_INVALID,
  TEST_PHONE_IT_VALID,
  TEST_PHONE_VALID,
  TEST_USERNAME,
  TEST_USER_CREATE,
  TEST_UUID
} from './tests/test.const';
