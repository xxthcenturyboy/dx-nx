import { ApiLoggingClass } from "@dx/logger";
import { PhoneUtil, PhoneUtilType } from './phone.util';
import { TEST_EXISTING_PHONE, TEST_PHONE } from "@dx/config";

describe('phone.util', () => {
  let phoneUtil: PhoneUtilType;
  const INVALID_IT_PHONE = '11 111 1111';
  const VALID_IT_PHONE = '06 555 5555';

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
    const nationalPhone = INVALID_IT_PHONE.replace(/\ /g, '');
    phoneUtil = new PhoneUtil(INVALID_IT_PHONE, 'IT');
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
    const nationalPhone = VALID_IT_PHONE.replace(/\ /g, '');
    phoneUtil = new PhoneUtil(`39 ${VALID_IT_PHONE}`, 'IT');
    // act
    // assert
    expect(phoneUtil.countryCode).toEqual('39');
    expect(phoneUtil.nationalNumber).toEqual(nationalPhone);
    expect(phoneUtil.isValid).toBe(true);
    expect(phoneUtil.phoneType).toBe(0);
    expect(phoneUtil.isValidMobile).toBe(false);
  });
});
