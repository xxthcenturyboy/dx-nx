import {
  ACCOUNT_RESTRICTIONS
} from './auth-shared.consts';

describe('ACCOUNT_RESTRICTIONS ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(ACCOUNT_RESTRICTIONS).toBeDefined();
  });

  it('should have correct value', () => {
    expect(ACCOUNT_RESTRICTIONS.ADMIN_LOCKOUT).toEqual('ADMIN_LOCKOUT');
    expect(ACCOUNT_RESTRICTIONS.LOGIN_ATTEMPTS).toEqual('LOGIN_ATTEMPTS');
    expect(ACCOUNT_RESTRICTIONS.OTP_LOCKOUT).toEqual('OTP_LOCKOUT');
  });
});
