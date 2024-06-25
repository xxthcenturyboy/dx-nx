import {
  PHONE_ENTITY_NAME,
  PHONE_POSTGRES_DB_NAME
} from './phone.consts';

describe('PHONE_ENTITY_NAME ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(PHONE_ENTITY_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(PHONE_ENTITY_NAME).toEqual('phone');
  });
});
describe('PHONE_POSTGRES_DB_NAME ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(PHONE_POSTGRES_DB_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(PHONE_POSTGRES_DB_NAME).toEqual('phone');
  });
});
