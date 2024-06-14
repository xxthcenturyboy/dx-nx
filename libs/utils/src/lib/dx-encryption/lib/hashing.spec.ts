import {
  dxEncryptionHashString,
  dxEncryptionVerifyHash
} from './hashing';

describe('dxEncryptionHashString', async () => {
  // arrange
  // act
  const hashString = await dxEncryptionHashString('stringToHash')
  // assert
  it('should exist when imported', () => {
    expect(dxEncryptionHashString).toBeDefined();
  });

  it('should hash a string when invoked', () => {
    expect(hashString).toBeDefined();
    expect(typeof hashString === 'string').toBeTruthy();
  });
});

describe('dxEncryptionVerifyHash', async () => {
  // arrange
  const stringToHash = 'string-test-value';
  // act
  const hashString = await dxEncryptionHashString(stringToHash)
  const verified = await dxEncryptionVerifyHash(hashString, stringToHash);
  const notVerified = await dxEncryptionVerifyHash(hashString, 'incorrect-value');
  // assert
  it('should exist when imported', () => {
    expect(dxEncryptionVerifyHash).toBeDefined();
  });

  it('should verify a hashed string when invoked', () => {
    expect(hashString).toBeDefined();
    expect(verified).toBeTruthy();
    expect(notVerified).toBeFalsy();
  });
});
