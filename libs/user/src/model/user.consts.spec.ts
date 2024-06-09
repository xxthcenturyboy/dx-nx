import {
  ACCOUNT_RESTRICTIONS,
  USER_ENTITY_NAME,
  USER_ROLE,
  USER_ROLE_ARRAY
} from './user.consts';

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

describe('USER_ENTITY_NAME ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(USER_ENTITY_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    expect(USER_ENTITY_NAME).toEqual('user');
  });
});

describe('USER_ROLE ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(USER_ROLE).toBeDefined();
  });

  it('should have correct value', () => {
    expect(USER_ROLE.ADMIN).toEqual('ADMIN');
    expect(USER_ROLE.SUPER_ADMIN).toEqual('SUPER_ADMIN');
    expect(USER_ROLE.USER).toEqual('USER');
  });
});

describe('USER_ROLE_ARRAY ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(USER_ROLE_ARRAY).toBeDefined();
  });

  it('should have correct values', () => {
    expect(USER_ROLE_ARRAY).toHaveLength(3);
  });
});
