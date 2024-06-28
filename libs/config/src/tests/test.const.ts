import { CreateUserPayloadType } from '@dx/user';

export const TEST_COUNTRY_CODE = '1';
export const TEST_EMAIL = 'test@test.com';
export const TEST_EXISTING_EMAIL = 'admin@danex.software';
export const TEST_EXISTING_PASSWORD = 'advancedbasics1';
export const TEST_EXISTING_PHONE = '2131112222';
export const TEST_EXISTING_USER_ID = '2cf4aebd-d30d-4c9e-9047-e52c10fe8d4d';
export const TEST_EXISTING_USER_PRIVILEGE_ID = 'e5a96fa3-ab58-4d27-b607-3a32d4cf7270';
export const TEST_FIRST_NAME = 'George';
export const TEST_LAST_NAME = 'Washington';
export const TEST_PASSWORD = 'password';
export const TEST_PHONE = '0123456789';
export const TEST_UUID = '9472bfb8-f7a9-4146-951e-15520f392baf';
export const TEST_USERNAME = 'username';
export const TEST_USER_CREATE: CreateUserPayloadType = {
  countryCode: TEST_COUNTRY_CODE,
  email: TEST_EMAIL,
  firstName: TEST_FIRST_NAME,
  lastName: TEST_LAST_NAME,
  phone: TEST_PHONE,
  roles: ['USER'],
  username: TEST_USERNAME,
};
