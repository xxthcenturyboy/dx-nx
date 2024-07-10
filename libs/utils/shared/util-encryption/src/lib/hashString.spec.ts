import { dxHashAnyToString } from './hashString';

describe('dxHashAnyToString', () => {
  // arrange
  const valueToHash = {
    testString: 'value',
    testNum: 123,
  };
  // act
  const hashedValue = dxHashAnyToString(valueToHash);
  // assert
  it('should exist when imported', () => {
    expect(dxHashAnyToString).toBeDefined();
  });

  it('should hash a string when invoked', () => {
    expect(hashedValue).toBeDefined();
    expect(typeof hashedValue === 'string').toBeTruthy();
  });
});
