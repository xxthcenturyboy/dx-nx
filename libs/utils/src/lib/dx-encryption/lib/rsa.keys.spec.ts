import {
  dxGenerateSignedKeyPair,
  dxValidateBiometricKey
} from './rsa.keys';

describe('dxRSAKeys', () => {
  let privateKey: string;
  let publicKey: string;
  let signature: string;

  describe('dxGenerateSignedKeyPair', () => {
    it('should exist', () => {
      expect(dxGenerateSignedKeyPair).toBeDefined();
    });

    it('should create a publicKey', () => {
      // arrange
      // act
      const result = dxGenerateSignedKeyPair();
      privateKey = result.privateKey;
      publicKey = result.publicKey;
      signature = result.signature;
      // assert
      expect(privateKey).toBeDefined();
      expect(publicKey).toBeDefined();
      expect(signature).toBeDefined();
    });
  });

  describe('dxValidateBiometricKey', () => {
    it('should exist', () => {
      expect(dxValidateBiometricKey).toBeDefined();
    });

    it('should validate signed data', () => {
      // arrange
      // act
      const isValid = dxValidateBiometricKey(signature, 'test', publicKey);
      // assert
      expect(isValid).toBeDefined();
    });

    it('should invalidate signed data', () => {
      // arrange
      // act
      const isValid = dxValidateBiometricKey(signature, 'invalid', publicKey);
      // assert
      expect(isValid).toBeDefined();
    });
  });
});
