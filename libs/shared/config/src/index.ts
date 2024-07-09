export {
  APP_DOMAIN,
  APP_NAME,
  APP_URL,
  COMPANY_NAME,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  DEFAULT_SORT,
  LOCAL_ENV_NAME,
  SORT_DIR,
} from './lib/common-config.consts';
export { CUSTOM_PROFANE_WORDS } from './lib/custom-profane-words.const';
export { DISPOSABLE_EMAIL_DOMAINS } from './lib/disposable-email-providers';
export { INVALID_EMAIL_NAMES } from './lib/email-validation.const';
export {
  getEnvironment,
  isDebug,
  isLocal,
  isProd,
  isTest,
} from './lib/common-config.service';


// Test Data
export {
  TEST_COUNTRY_CODE,
  TEST_DEVICE,
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
  TEST_UUID,
} from './lib/tests/test.const';
