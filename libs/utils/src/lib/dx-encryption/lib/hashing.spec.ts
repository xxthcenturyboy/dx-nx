import {
  dxEncryptionHashString,
  dxEncryptionVerifyHash
} from './hashing';

describe('dxEncryptionHashString', () => {
  test('hashing a string', async () => {
    // arrange
    // act
    const hashString = await dxEncryptionHashString('stringToHash')
    // assert
    expect(dxEncryptionHashString).toBeDefined();
    expect(hashString).toBeDefined();
    expect(typeof hashString === 'string').toBeTruthy();
  });

});

describe('dxEncryptionVerifyHash', () => {
  test('validating a hash string', async () => {
    // arrange
    const stringToHash = 'string-test-value';
    // act
    const hashString = await dxEncryptionHashString(stringToHash)
    const verified = await dxEncryptionVerifyHash(hashString, stringToHash);
    const notVerified = await dxEncryptionVerifyHash(hashString, 'incorrect-value');
    // assert
    expect(dxEncryptionVerifyHash).toBeDefined();
    expect(hashString).toBeDefined();
    expect(verified).toBeTruthy();
    expect(notVerified).toBeFalsy();
  });

});
