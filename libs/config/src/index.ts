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
  POSTGRES_URI,
  SENDGRID_API_KEY,
  SENDGRID_URL
} from './api/api-config.consts';
export { ApiConfigType } from './api/api-config.type';
export {
  APP_DOMAIN,
  COMPANY_NAME,
  SORT_DIR
} from './common/common-config.consts';
export {
  isLocal,
  isProd
} from './common/common-config.service';

// Client
export {
  CLIENT_APP_DOMAIN,
  CLIENT_APP_URL
} from './client/client-config.consts';

// Test Data
export {
  TEST_COUNTRY_CODE,
  TEST_EMAIL,
  TEST_EXISTING_EMAIL,
  TEST_EXISTING_PASSWORD,
  TEST_EXISTING_PHONE,
  TEST_EXISTING_USER_ID,
  TEST_EXISTING_USER_PRIVILEGE_ID,
  TEST_PASSWORD,
  TEST_PHONE,
  TEST_UUID
} from './tests/test.const';
