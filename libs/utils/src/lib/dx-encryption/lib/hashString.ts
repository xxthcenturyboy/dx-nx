import * as crypto from 'crypto';

export const dxEncryptionHashAnyToString = (data: any): string => {
  const hash = crypto.createHash('sha1');
  return hash.update(JSON.stringify(data)).digest('base64');
};
