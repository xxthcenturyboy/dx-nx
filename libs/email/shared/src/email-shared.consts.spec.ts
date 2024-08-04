import {
  EMAIL_LABEL
} from './email-shared.consts';

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
