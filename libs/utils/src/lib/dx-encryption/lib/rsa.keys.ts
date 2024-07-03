import NodeRsa from 'node-rsa';

export function dxValidateBiometricKey(
  signature: string,
  payload: string,
  publicKey: string
) {
  const publicKeyBuffer = Buffer.from(publicKey, 'base64');
  const key = new NodeRsa();
  const signer = key.importKey(publicKeyBuffer, 'pkcs1-public-der');
  return signer.verify(Buffer.from(payload), signature, 'utf8', 'base64');
}
