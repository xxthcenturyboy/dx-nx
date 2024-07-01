import {
  RedisService,
  RedisServiceType,
  REDIS_DELIMITER
} from "@dx/redis";
import {
  ApiLoggingClass,
  ApiLoggingClassType
} from "@dx/logger";
import {
  dxEncryptionGgenerateOTP,
  dxEncryptionGenerateHashWithSalt
} from '@dx/utils';
import { OTP_SALT } from '@dx/config';
import { RedisExpireOptions } from "libs/data/redis/src/redis.types";

export class OtpCodeCache {
  cache: RedisServiceType;
  cacheExpirationOptions: RedisExpireOptions = {
    token: 'EX',
    time: 2 * 60 // 2 minutes
  };
  keyPrefix = 'otp';
  logger: ApiLoggingClassType;

  constructor() {
    this.cache = RedisService.instance;
    this.logger = ApiLoggingClass.instance;
  }

  private getFormattedKeyName(keyValue?: string): string {
    if (keyValue) {
      return `${this.keyPrefix}${REDIS_DELIMITER}${keyValue}`;
    }
    return `*${this.keyPrefix}*`;
  }

  private async getHashedPhoneValue(
    countryCode: string,
    nationalNumber: string
  ) {
    return await dxEncryptionGenerateHashWithSalt(`${countryCode}${nationalNumber}`, OTP_SALT);
  }

  public async setEmailOtp(
    email: string
  ): Promise<string> {
    if (
      !email
    ) {
      return '';
    }

    const code = dxEncryptionGgenerateOTP(6);
    const hashedValue = await dxEncryptionGenerateHashWithSalt(email, OTP_SALT);
    const key = this.getFormattedKeyName(`${code}_${hashedValue}`);
    try {
      await this.cache.setCacheItemWithExpiration(key, code, this.cacheExpirationOptions);
      return code;
    } catch (err) {
      this.logger.logError(err);
      return '';
    }
  }

  public async setPhoneOtp(
    countryCode: string,
    nationalNumber: string
  ): Promise<string> {
    if (
      !countryCode
      || !nationalNumber
    ) {
      return '';
    }

    const code = dxEncryptionGgenerateOTP(6);
    const hashedValue = await this.getHashedPhoneValue(countryCode, nationalNumber);
    const key = this.getFormattedKeyName(`${code}_${hashedValue}`);
    try {
      await this.cache.setCacheItemWithExpiration(key, code, this.cacheExpirationOptions);
      return code;
    } catch (err) {
      this.logger.logError(err);
      return '';
    }
  }

  public async validateEmailOtp(
    code: string,
    email: string
  ): Promise<boolean> {
    if (
      !email
      || !code
    ) {
      return false;
    }

    const hashedValue = await dxEncryptionGenerateHashWithSalt(email, OTP_SALT);
    const key = this.getFormattedKeyName(`${code}_${hashedValue}`);
    try {
      const data = await this.cache.getCacheItemSimple(key);
      const isValid = data?.toString() === code?.toString();
      if (isValid) {
        void this.cache.deleteCacheItem(key);
      }
      return isValid;
    } catch (err) {
      this.logger.logError(err);
    }

    return false;
  }

  public async validatePhoneOtp(
    code: string,
    countryCode: string,
    nationalNumber: string
  ): Promise<boolean> {
    if (
      !countryCode
      || !nationalNumber
      || !code
    ) {
      return false;
    }

    const hashedValue = await this.getHashedPhoneValue(countryCode, nationalNumber);
    const key = this.getFormattedKeyName(`${code}_${hashedValue}`);
    try {
      const data = await this.cache.getCacheItemSimple(key);
      const isValid = data?.toString() === code?.toString();
      if (isValid) {
        void this.cache.deleteCacheItem(key);
      }
      return isValid;
    } catch (err) {
      this.logger.logError(err);
    }

    return false;
  }
}

export type OtpCodeCacheType = typeof OtpCodeCache.prototype;
