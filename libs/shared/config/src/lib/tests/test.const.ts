import { PHONE_DEFAULT_REGION_CODE } from '@dx/phone';
import { CreateUserPayloadType } from '@dx/user';
import { DeviceAuthType } from '@dx/devices';

export const TEST_COUNTRY_CODE = '1';
export const TEST_DEVICE: DeviceAuthType = {
  uniqueDeviceId: 'e5a96fa3-ab58-4d27-b607-3a32d4cf7270',
  deviceId: 'test-device-id',
  carrier: 'ATT',
  deviceCountry: 'US',
  name: 'iPhone,16',
};
export const TEST_EMAIL = 'test@test.com';
export const TEST_EXISTING_EMAIL = 'admin@danex.software';
export const TEST_EXISTING_PASSWORD = 'advancedbasics1';
export const TEST_EXISTING_PHONE = '8584846800';
export const TEST_EXISTING_USER_ID = '2cf4aebd-d30d-4c9e-9047-e52c10fe8d4d';
export const TEST_EXISTING_USER_PRIVILEGE_ID =
  'e5a96fa3-ab58-4d27-b607-3a32d4cf7270';
export const TEST_FIRST_NAME = 'George';
export const TEST_LAST_NAME = 'Washington';
export const TEST_PASSWORD = 'password';
export const TEST_PHONE = '0123456789';
export const TEST_PHONE_IT_INVALID = '11 111 1111';
export const TEST_PHONE_VALID = '8584846801';
export const TEST_PHONE_IT_VALID = '06 555 5555';
export const TEST_UUID = '9472bfb8-f7a9-4146-951e-15520f392baf';
export const TEST_USERNAME = 'username';
export const TEST_USER_CREATE: CreateUserPayloadType = {
  countryCode: TEST_COUNTRY_CODE,
  regionCode: PHONE_DEFAULT_REGION_CODE,
  email: TEST_EMAIL,
  firstName: TEST_FIRST_NAME,
  lastName: TEST_LAST_NAME,
  isTest: true,
  phone: TEST_PHONE_VALID,
  roles: ['USER'],
  username: TEST_USERNAME,
};
