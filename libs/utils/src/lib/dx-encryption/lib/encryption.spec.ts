import {
  dxEncriptionEncryptString,
  dxEncryptionDecryptString,
} from './encryption';
import { CRYPT_KEY } from '@dx/config-api';

describe('dxEncriptionEncryptString', () => {
  // arrange
  const key = Buffer.from(CRYPT_KEY, 'hex');
  // act
  const encryptionResult = dxEncriptionEncryptString('stringToEncrypt', key);
  key.fill(0);
  // assert
  it('should exist when imported', () => {
    expect(dxEncriptionEncryptString).toBeDefined();
  });

  it('should encrypt a string when invoked', () => {
    expect(encryptionResult).toBeDefined();
    expect(typeof encryptionResult.encryptedValue === 'string').toBeTruthy();
    expect(typeof encryptionResult.iv === 'string').toBeTruthy();
  });
});

describe('dxEncryptionDecryptString', () => {
  // arrange
  const key = Buffer.from(CRYPT_KEY, 'hex');
  const stringToEncrypt = 'string-test-value';
  // act
  const encryptedResult = dxEncriptionEncryptString(stringToEncrypt, key);
  const decryptedValue = dxEncryptionDecryptString(
    encryptedResult.encryptedValue,
    encryptedResult.iv,
    key
  );
  key.fill(0);
  // assert
  it('should exist when imported', () => {
    expect(dxEncryptionDecryptString).toBeDefined();
  });

  it('should decrypt an encrypted string when invoked', () => {
    expect(decryptedValue).toBeDefined();
    expect(typeof decryptedValue === 'string').toBeTruthy();
    expect(decryptedValue).toEqual(stringToEncrypt);
  });
});

describe('decrypt previous encryption', () => {
  // arrange
  const key = Buffer.from(CRYPT_KEY, 'hex');
  const hc = {
    iv: 'af00abcef8622e2e28431bc811368813',
    encryptedValue:
      '6bd3f2eee7a3caed2eda27488198eceb403ad0e3b7958522925305547845c2f3',
  };
  // act
  const result = dxEncryptionDecryptString(hc.encryptedValue, hc.iv, key);
  key.fill(0);
  // assert
  it('should decrypt hard-coded values', () => {
    expect(result).toBeDefined();
  });
});
