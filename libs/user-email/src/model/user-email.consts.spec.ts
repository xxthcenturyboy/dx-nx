import {
  USER_EMAIL_ENTITY_NAME,
  USER_EMAIL_LABEL
} from './user-email.consts';

describe('USER_EMAIL_ENTITY_NAME ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(USER_EMAIL_ENTITY_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    expect(USER_EMAIL_ENTITY_NAME).toEqual('user-email');
  });
});

describe('USER_EMAIL_LABEL ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(USER_EMAIL_LABEL).toBeDefined();
  });

  it('should have correct value', () => {
    expect(USER_EMAIL_LABEL.DEFAULT).toEqual('Default');
    expect(USER_EMAIL_LABEL.MAIN).toEqual('Main');
  });
});
