import { randomBytes } from 'crypto';

export { dxGenerateOtp, dxGenerateRandomValue };

//////////////////////

function dxGenerateRandomValue(length?: number): string | null {
  const value = randomBytes(length || 48);
  return value.toString('hex');
}

function dxGenerateOtp(codeLength = 6) {
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
