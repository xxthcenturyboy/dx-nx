import {
  AUTH_ENTITY_NAME,
  AUTH_TOKEN_NAMES
} from './auth.consts';

describe('AUTH_ENTITY_NAME ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(AUTH_ENTITY_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    expect(AUTH_ENTITY_NAME).toEqual('auth');
  });
});

describe('AUTH_TOKEN_NAMES ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(AUTH_TOKEN_NAMES).toBeDefined();
  });

  it('should have correct value', () => {
    expect(AUTH_TOKEN_NAMES.AUTH).toEqual('token');
    expect(AUTH_TOKEN_NAMES.EXP).toEqual('exp');
    expect(AUTH_TOKEN_NAMES.REFRESH).toEqual('refresh');
  });
});
