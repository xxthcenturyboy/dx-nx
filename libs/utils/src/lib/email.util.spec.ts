import { ApiLoggingClass } from "@dx/logger";
import {
  EmailUtil,
  EmailUtilType
} from './email.util';
import {
  APP_DOMAIN,
  TEST_EMAIL
} from "@dx/config";

describe('email.util', () => {
  let emailUtil: EmailUtilType;

  beforeAll(() => {
    new ApiLoggingClass({ appName: 'test' });
  });

  test('should invalidate a bogus email', () => {
    // arrange
    emailUtil = new EmailUtil('not-an-email');
    // act
    const isValid = emailUtil.validate();
    // assert
    expect(isValid).toBe(false);
  });

  test('should invalidate a blacklisted domain', () => {
    // arrange
    emailUtil = new EmailUtil(`any@027168.com`);
    // act
    const isValid = emailUtil.validate();
    // assert
    expect(isValid).toBe(false);
  });

  test('should invalidate an email with restricted name', () => {
    // arrange
    emailUtil = new EmailUtil(`admin@email.com`);
    // act
    const isValid = emailUtil.validate();
    // assert
    expect(isValid).toBe(false);
  });

  test('should flag an email with potentially bad gmail', () => {
    // arrange
    emailUtil = new EmailUtil(`d.j.u@advancedbasics.com`);
    // act
    const isValid = emailUtil.validate();
    // assert
    expect(isValid).toBe(true);
    expect(emailUtil.isMaybeBadGmail()).toBe(true);
    expect(emailUtil.countOfDotsInName()).toEqual(2);
  });

  test('should strip all + symbols from an email', () => {
    // arrange
    emailUtil = new EmailUtil(`dan+2@gmail.com`);
    // act
    const isValid = emailUtil.validate();
    // assert
    expect(isValid).toBe(true);
    expect(emailUtil.formattedEmail()).toEqual('dan@gmail.com');
  });

  test('should validate a whitelisted email', () => {
    // arrange
    emailUtil = new EmailUtil(`admin@${APP_DOMAIN}`);
    // act
    const isValid = emailUtil.validate();
    // assert
    expect(isValid).toBe(true);
  });

  test('should validate a valid email', () => {
    // arrange
    emailUtil = new EmailUtil(TEST_EMAIL);
    // act
    const isValid = emailUtil.validate();
    // assert
    expect(isValid).toBe(true);
  });
});
