import {
  AUTH_ENTITY_NAME,
  AUTH_TOKEN_NAMES,
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
    expect(AUTH_TOKEN_NAMES.REFRESH).toEqual('refresh');
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
    expect(USER_LOOKUPS.USERNAME).toEqual('username');
  });
});
