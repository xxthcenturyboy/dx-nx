import { dxEncryptionGenerateRandomValue } from './randomValue';

describe('dxEncryptionGenerateRandomValue', () => {
  // arrange
  const BYTES = 16;
  // act
  const randomValue = dxEncryptionGenerateRandomValue(BYTES);
  // assert
  it('should exist when imported', () => {
    expect(dxEncryptionGenerateRandomValue).toBeDefined();
  });

  it('should generate a random value when invoked', () => {
    expect(randomValue).toBeDefined();
    expect(randomValue).toHaveLength(BYTES * 2);
  });
});
