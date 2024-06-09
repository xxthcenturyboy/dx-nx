import { USER_PRIVILEGES_ENTITY_NAME } from './user-privileges.consts';

describe('USER_PRIVILEGES_ENTITY_NAME ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(USER_PRIVILEGES_ENTITY_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    expect(USER_PRIVILEGES_ENTITY_NAME).toEqual('user-privileges');
  });
});
