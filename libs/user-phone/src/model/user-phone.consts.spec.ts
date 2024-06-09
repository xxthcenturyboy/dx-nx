import { USER_PHONE_ENTITY_NAME } from './user-phone.consts';

describe('USER_PHONE_ENTITY_NAME ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(USER_PHONE_ENTITY_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    expect(USER_PHONE_ENTITY_NAME).toEqual('user-phone');
  });
});
