import cp from 'child_process';

import { ApiLoggingClass, ApiLoggingClassType } from '@dx/logger-api';
import { regexEmail } from '@dx/util-regex';
import { APP_DOMAIN } from '@dx/config-shared';
import {
  DISPOSABLE_EMAIL_DOMAINS,
  INVALID_EMAIL_NAMES,
} from '@dx/config-shared';

export class EmailUtil {
  logger: ApiLoggingClassType;
  regexDots = /\./g;
  regexConsecutiveDots = /\.\./;
  rawValue = '';
  parts: string[];

  constructor(email: string) {
    this.logger = ApiLoggingClass.instance;
    this.rawValue = email;
    this.parts = email.split('@');
  }

  get domain() {
    return this.domainParts?.join('.');
  }

  get domainParts() {
    return this.parts[1]?.split('.');
  }

  get name() {
    return this.parts[0] || '';
  }

  get isNumbers() {
    return /^[0-9]+$/.test(this.name);
  }

  countOfDotsInName() {
    return (this.name.match(this.regexDots) || []).length;
  }

  hasConsecutiveDots() {
    return this.regexConsecutiveDots.test(this.name);
  }

  hasInvalidName() {
    const regexInvalidName = new RegExp(
      `^(${INVALID_EMAIL_NAMES.join('|')})`,
      'i'
    );
    return regexInvalidName.test(this.name);
  }

  strippedName() {
    return this.name && this.name.replace(/[.]/g, '');
  }

  digMxRecord() {
    try {
      return cp.execSync(`dig ${this.domain} MX`).toString();
    } catch (err) {
      this.logger.logError(`Could not dig MX for: ${this.domain}`);
      return '';
    }
  }

  isMaybeBadGmail() {
    const digRecord = this.digMxRecord();
    return (
      (this.domain === 'gmail.com' ||
        digRecord.includes('aspmx.l.google.com')) &&
      this.name.includes('.')
    );
  }

  formattedName() {
    if (this.name && this.hasConsecutiveDots()) {
      return this.strippedName();
    }

    return this.name;
  }

  stripPlusN(namePart: string) {
    const plusOneIndex = namePart.indexOf('+');
    const endIndex = plusOneIndex > -1 ? plusOneIndex : namePart.length;
    return namePart.slice(0, endIndex);
  }

  strippedEmailForIndex() {
    const strippedEmail = `${this.stripPlusN(this.strippedName())}@${
      this.domain
    }`;
    return strippedEmail.toLowerCase().trim();
  }

  formattedEmail() {
    const email = `${this.stripPlusN(this.formattedName())}@${this.domain}`;
    return email.toLowerCase().trim();
  }

  isDisposableDomain(): boolean {
    return DISPOSABLE_EMAIL_DOMAINS[this.domain] || false;
  }

  whitelistedEmail() {
    return this.domain.includes(APP_DOMAIN);
  }

  validate() {
    if (!this.rawValue) {
      return false;
    }

    if (this.rawValue.length > 254) {
      return false;
    }

    if (!regexEmail.test(this.rawValue)) {
      return false;
    }

    if (this.name.length > 64) {
      return false;
    }

    if (this.domainParts.some((part) => part.length > 63)) {
      return false;
    }

    if (this.isDisposableDomain()) {
      return false;
    }

    if (this.isNumbers) {
      return false;
    }

    if (this.whitelistedEmail()) {
      return true;
    }

    if (this.hasInvalidName()) {
      return false;
    }

    return true;
  }
}

export type EmailUtilType = typeof EmailUtil.prototype;
