import * as crypto from 'crypto';

export {
  dxEncryptionGenerateRandomValue
};

//////////////////////

function dxEncryptionGenerateRandomValue(length?: number): string | null {
  const value = crypto.randomBytes(length || 48);
  return value.toString('hex');
}
