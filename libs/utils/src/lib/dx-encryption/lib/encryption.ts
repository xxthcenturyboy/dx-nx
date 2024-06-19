import * as crypto from 'crypto';
import { EncryptionReturnType } from './encryption.types';

const ALGORITHM = {
  BLOCK_CIPHER: 'aes-256-cbc',
  AUTH_TAG_BYTE_LEN: 16,
  IV_BYTE_LEN: 16,
  KEY_BYTE_LEN: 32,
  SALT_BYTE_LEN: 16
};

function getIv() {
  return crypto.randomBytes(ALGORITHM.IV_BYTE_LEN);
}

function getRandomKey() {
  return crypto.randomBytes(ALGORITHM.KEY_BYTE_LEN);
}

function getSalt() {
  return crypto.randomBytes(ALGORITHM.SALT_BYTE_LEN);
}

function getKeyFromPassword(password: string, salt: string) {
  return crypto.scryptSync(Buffer.from(password), Buffer.from(salt), ALGORITHM.KEY_BYTE_LEN);
};

function clearBuffers(buffers: Buffer[]) {
  buffers.forEach(buffer => buffer.fill(0));
}

export function dxEncriptionEncryptString(
  text: string,
  key: Buffer
): EncryptionReturnType {
  const iv = getIv();
  let cipher = crypto.createCipheriv(ALGORITHM.BLOCK_CIPHER, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const ivString = iv.toString('hex');
  const encryptedString = encrypted.toString('hex');
  clearBuffers([
    encrypted,
    iv
  ]);
  return {
    iv: ivString,
    encryptedValue: encryptedString
  };
}

export function dxEncryptionDecryptString(
  encryptedValue: string,
  ivValue: string,
  key: Buffer
): string {
  let iv = Buffer.from(ivValue, 'hex');
  let encryptedText = Buffer.from(encryptedValue, 'hex');
  let decipher = crypto.createDecipheriv(ALGORITHM.BLOCK_CIPHER, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  const result = decrypted.toString();
  clearBuffers([
    decrypted,
    encryptedText,
    iv
  ]);
  return result;
}
