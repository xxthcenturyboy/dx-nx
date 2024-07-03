import {
  AUTH_ENTITY_NAME,
  AUTH_TOKEN_NAMES,
  AUTH_ROUTES_V1_RATE_LIMIT,
  CLIENT_ROUTE,
  USER_LOOKUPS
} from './auth.consts';

describe('AUTH_ENTITY_NAME ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(AUTH_ENTITY_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(AUTH_ENTITY_NAME).toEqual('auth');
  });
});

describe('AUTH_TOKEN_NAMES ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(AUTH_TOKEN_NAMES).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(AUTH_TOKEN_NAMES.AUTH).toEqual('token');
    expect(AUTH_TOKEN_NAMES.EXP).toEqual('exp');
    expect(AUTH_TOKEN_NAMES.REFRESH).toEqual('jwt');
  });
});

describe('AUTH_ROUTES_V1_RATE_LIMIT ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(AUTH_ROUTES_V1_RATE_LIMIT).toBeDefined();
  });

  it('should have correct values', () => {
    // arrange
    // act
    // assert
    expect(AUTH_ROUTES_V1_RATE_LIMIT).toHaveLength(6);
    expect(AUTH_ROUTES_V1_RATE_LIMIT).toEqual([
      'api/v1/auth/login',
      'api/v1/auth/lookup',
      'api/v1/auth/otp-code/send/email',
      'api/v1/auth/otp-code/send/phone',
      'api/v1/auth/refresh-token',
      'api/v1/auth/validate/email',
    ]);
  });
});

describe('CLIENT_ROUTE ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(CLIENT_ROUTE).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(CLIENT_ROUTE.INVITE).toEqual('invite');
    expect(CLIENT_ROUTE.OTP_LOCK).toEqual('otp-lock');
    expect(CLIENT_ROUTE.RESET).toEqual('reset');
    expect(CLIENT_ROUTE.VALIDATE_EMAIL).toEqual('validate-email');
  });
});

describe('USER_LOOKUPS ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(USER_LOOKUPS).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(USER_LOOKUPS.EMAIL).toEqual('email');
    expect(USER_LOOKUPS.PHONE).toEqual('phone');
  });
});
