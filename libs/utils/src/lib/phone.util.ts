import * as phonelib from 'google-libphonenumber';

const phoneUtil = phonelib.PhoneNumberUtil.getInstance();

export function normalizePhone(phone: string): string {
  if (phone[0] === '+') {
    // NOTE: isValidNumber will throw an error in certain cases
    // like if the phone number is only one digit or very long
    try {
      const number = phoneUtil.parseAndKeepRawInput(phone, 'US');
      const isValid = phoneUtil.isValidNumber(number);
      if (isValid) {
        return phone;
      }
    } catch (err) {
      console.error(err);
    }
  }

  let digits = phone.replace(/[^\d]+/g, '');
  if (digits.length === 10) {
    digits = `1${digits}`; // US country code required for SNS
  }

  return `+${digits}`;
}
