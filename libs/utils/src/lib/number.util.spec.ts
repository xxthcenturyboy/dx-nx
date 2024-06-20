import {
  isNumber,
  randomId
} from './number.util';

describe('isNumber', () => {
  // arrange
  // act
  // assert
  it('should return true when passed a number', () => {
    expect(isNumber(1)).toBeTruthy();
    expect(isNumber(2e64)).toBeTruthy();
  });

  it('should return false when passed a non-number', () => {
    expect(isNumber('1')).toBeFalsy();
    expect(isNumber(Infinity)).toBeFalsy();
    expect(isNumber(NaN)).toBeFalsy();
    expect(isNumber(null)).toBeFalsy();
  });
});

describe('randomId', () => {
  it('should return a randomId when invoked', () => {
    // arrange
    // act
    const random = randomId()
    // assert
    expect(random).toBeDefined();
    expect(typeof random === 'number').toBeTruthy();
  });
});
