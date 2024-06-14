import { dxEncryptionGenerateRandomValue } from './randomValue';

describe('dxEncryptionGenerateRandomValue', () => {
  // arrange
  // act
  const randomValue = dxEncryptionGenerateRandomValue(5)
  // assert
  it('should exist when imported', () => {
    expect(dxEncryptionGenerateRandomValue).toBeDefined();
  });

  it('should generate a random value when invoked', () => {
    expect(randomValue).toBeDefined();
    expect(randomValue).toHaveLength(5);
  });
});
