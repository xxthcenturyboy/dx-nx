import * as crypto from 'crypto';

export {
  dxEncryptionGgenerateOTP,
  dxEncryptionGenerateRandomValue
};

//////////////////////

function dxEncryptionGenerateRandomValue(length?: number): string | null {
  const value = crypto.randomBytes(length || 48);
  return value.toString('hex');
}

function dxEncryptionGgenerateOTP(codeLength = 6) {
  // Declare a digits variable
  // which stores all digits
  let digits = '0123456789';
  let OTP = '';
  let len = digits.length;
  for (let i = 0; i < codeLength; i++) {
      OTP += digits[Math.floor(Math.random() * len)];
  }
  return OTP;
}
