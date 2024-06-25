import {
  EMAIL_ENTITY_NAME,
  EMAIL_LABEL,
  EMAIL_POSTGRES_DB_NAME
} from './email.consts';

describe('EMAIL_ENTITY_NAME ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(EMAIL_ENTITY_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(EMAIL_ENTITY_NAME).toEqual('email');
  });
});
describe('EMAIL_LABEL ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(EMAIL_LABEL).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(EMAIL_LABEL.DEFAULT).toEqual('Default');
    expect(EMAIL_LABEL.MAIN).toEqual('Main');
  });
});
describe('EMAIL_POSTGRES_DB_NAME ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(EMAIL_POSTGRES_DB_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(EMAIL_POSTGRES_DB_NAME).toEqual('email');
  });
});
