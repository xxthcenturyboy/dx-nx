import {
  PhoneNumber,
  PhoneNumberUtil
} from 'google-libphonenumber';

import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger';
import { isDebug } from '@dx/config';

export class PhoneUtil {
  private phoneUtil: typeof PhoneNumberUtil.prototype;
  private logger: ApiLoggingClassType;
  private phoneParsed: PhoneNumber;

  constructor(
    phone: string,
    twoLetterRegionCode: string
  ) {
    this.logger = ApiLoggingClass.instance;
    this.phoneUtil = PhoneNumberUtil.getInstance();

    if (
      phone
      && twoLetterRegionCode
    ) {
      try {
        this.phoneParsed = this.phoneUtil.parseAndKeepRawInput(phone, twoLetterRegionCode);
      } catch (err) {
        isDebug() && this.logger.logError(err.message || 'PhoneUtil Constructor Error');
      }
    }
  }

  get isValidMobile (): boolean {
    return this.phoneType == 2
      || this.phoneType === 3;
  }

  get countryCode (): string {
    return this.phoneParsed?.getCountryCode().toString() || '';
  }

  get nationalNumber (): string {
    const zeros = this.phoneParsed?.numberOfLeadingZerosCount() || this.phoneParsed?.italianLeadingZeroCount();
    const number = this.phoneParsed?.getNationalNumber().toString();
    if (!zeros) {
      return number;
    }

    let paddedNumber = '';
    for (let i = 0; i < zeros; i += 1) {
      paddedNumber = `${paddedNumber}0`;
    }

    return `${paddedNumber}${number}`.replace(/\ /g, '');
  }

  get normalizedPhone (): string {
    const normalizePhone = `+${this.countryCode}${this.nationalNumber}`;
    return normalizePhone;
  }

  get isValid (): boolean {
    return this.phoneParsed
      && this.phoneUtil.isValidNumber(this.phoneParsed);
  }

  get phoneType (): number {
    return this.phoneParsed
      && this.phoneUtil.getNumberType(this.phoneParsed);;
  }

  get phoneTypeString (): string {
    switch(this.phoneType) {
      case 1:
        return 'MOBILE';
      case 2:
        return 'FIXED_OR_MOBILE';
      default:
        return 'ZZ';
    };
  }
}

export type PhoneUtilType = typeof PhoneUtil.prototype;
