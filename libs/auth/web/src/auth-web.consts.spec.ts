import {
  AUTH_ENTITY_NAME
} from './auth-web.consts';

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
