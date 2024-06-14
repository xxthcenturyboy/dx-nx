import { dxEncryptionHashAnyToString } from './hashString';

describe('dxEncryptionHashAnyToString', () => {
  // arrange
  const valueToHash = {
    testString: 'value',
    testNum: 123
  }
  // act
  const hashedValue = dxEncryptionHashAnyToString(valueToHash)
  // assert
  it('should exist when imported', () => {
    expect(dxEncryptionHashAnyToString).toBeDefined();
  });

  it('should hash a string when invoked', () => {
    expect(hashedValue).toBeDefined();
    expect(typeof hashedValue === 'string').toBeTruthy();
  });
});
