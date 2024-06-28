import { ApiLoggingClass } from "@dx/logger";
import {
  PhoneUtil,
  PhoneUtilType
} from './phone.util';
import {
  TEST_EXISTING_PHONE,
  TEST_PHONE,
  TEST_PHONE_IT_INVALID,
  TEST_PHONE_IT_VALID
} from "@dx/config";

describe('phone.util', () => {
  let phoneUtil: PhoneUtilType;

  beforeAll(() => {
    new ApiLoggingClass({ appName: 'test' });
  });

  test('should invalidate a bogus US phone number', () => {
    // arrange
    const nationalPhone = TEST_PHONE.replace(/\ /g, '');
    phoneUtil = new PhoneUtil(TEST_PHONE, 'US');
    // act
    // assert
    expect(phoneUtil.countryCode).toEqual('1');
    expect(phoneUtil.nationalNumber).toEqual(nationalPhone);
    expect(phoneUtil.isValid).toBe(false);
    expect(phoneUtil.phoneType).toBe(-1);
    expect(phoneUtil.isValidMobile).toBe(false);
  });

  test('should invalidate a bogus an Italian phone number', () => {
    // arrange
    const nationalPhone = TEST_PHONE_IT_INVALID.replace(/\ /g, '');
    phoneUtil = new PhoneUtil(TEST_PHONE_IT_INVALID, 'IT');
    // act
    // assert
    expect(phoneUtil.countryCode).toEqual('39');
    expect(phoneUtil.nationalNumber).toEqual(nationalPhone);
    expect(phoneUtil.isValid).toBe(false);
    expect(phoneUtil.phoneType).toBe(-1);
    expect(phoneUtil.isValidMobile).toBe(false);
  });

  test('should validate a valid US phone number', () => {
    // arrange
    const nationalPhone = TEST_EXISTING_PHONE.replace(/\ /g, '');
    phoneUtil = new PhoneUtil(TEST_EXISTING_PHONE, 'US');
    // act
    // assert
    expect(phoneUtil.countryCode).toEqual('1');
    expect(phoneUtil.nationalNumber).toEqual(nationalPhone);
    expect(phoneUtil.isValid).toBe(true);
    expect(phoneUtil.phoneType).toBe(2);
    expect(phoneUtil.isValidMobile).toBe(true);
  });

  test('should validate a valid an Italian phone number', () => {
    // arrange
    const nationalPhone = TEST_PHONE_IT_VALID.replace(/\ /g, '');
    phoneUtil = new PhoneUtil(`39 ${TEST_PHONE_IT_VALID}`, 'IT');
    // act
    // assert
    expect(phoneUtil.countryCode).toEqual('39');
    expect(phoneUtil.nationalNumber).toEqual(nationalPhone);
    expect(phoneUtil.isValid).toBe(true);
    expect(phoneUtil.phoneType).toBe(0);
    expect(phoneUtil.isValidMobile).toBe(false);
  });
});
