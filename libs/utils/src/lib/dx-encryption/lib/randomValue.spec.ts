import {
  dxEncryptionGgenerateOTP,
  dxEncryptionGenerateRandomValue
} from './randomValue';

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

describe('dxEncryptionGgenerateOTP', () => {
  // arrange
  const CODE_LENGTH = 6;
  // act
  const otp = dxEncryptionGgenerateOTP(CODE_LENGTH);
  // assert
  it('should exist when imported', () => {
    expect(dxEncryptionGgenerateOTP).toBeDefined();
  });

  it('should generate an OTP code when invoked', () => {
    expect(otp).toBeDefined();
    expect(otp).toHaveLength(CODE_LENGTH);
  });
});
