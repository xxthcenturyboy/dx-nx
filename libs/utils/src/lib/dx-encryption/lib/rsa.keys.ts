import NodeRsa from 'node-rsa';

export type KeyPairsResponse = {
  publicKey: string;
  privateKey: string;
  signature: string;
};

export function dxGenerateSignedKeyPair(): KeyPairsResponse {
  const key = new NodeRsa();
  const pair = key.generateKeyPair();
  const publicKey = pair.exportKey('pkcs1-public-der').toString('base64');
  const privateKey = pair.exportKey('pkcs1-der').toString('base64');
  const signature = pair.sign(Buffer.from('test'));
  return {
    publicKey,
    privateKey,
    signature: signature.toString('base64')
  };
}

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
