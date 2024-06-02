import { USER_ENTITY_NAME } from './user.consts';

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
