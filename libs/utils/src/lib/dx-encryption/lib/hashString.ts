import { createHash } from 'crypto';

export const dxEncryptionHashAnyToString = (data: any): string => {
  const hash = createHash('sha1');
  return hash.update(JSON.stringify(data)).digest('base64');
};
