import { ApiLoggingClass } from '@dx/logger-api';
import { OtpCodeCache } from './otp-code.redis-cache';
import { UserModel } from '@dx/user-api';

export class OtpService {
  public static async generateOptCode(userId: string): Promise<string> {
    const codeCache = new OtpCodeCache();
    const logger = ApiLoggingClass.instance;
    let otpCode: string;

    try {
      const user = await UserModel.findByPk(userId);
      if (!user) {
        throw new Error(
          `User could not be found with the id: ${userId} for generate OPT`
        );
      }
      if (user.accountLocked) {
        throw new Error(`Account is locked.`);
      }

      const phone = await user.getDefaultPhoneModel();
      if (phone && phone.phone && phone.countryCode) {
        otpCode = await codeCache.setPhoneOtp(phone.countryCode, phone.phone);
        // TODO: integrate with Twilio or other to send SMS
        return otpCode;
      }

      if (!otpCode) {
        const email = await user.getDefaultEmailModel();
        if (email) {
          otpCode = await codeCache.setEmailOtp(email.email);
        }
      }

      return otpCode;
    } catch (err) {
      logger.logError(err.message);
    }

    return otpCode;
  }

  public static async validateOptCode(
    userId: string,
    code: string
  ): Promise<boolean> {
    if (!userId || !code) {
      throw new Error('Insufficient data.');
    }
    const codeCache = new OtpCodeCache();
    const logger = ApiLoggingClass.instance;

    try {
      const user = await UserModel.findByPk(userId);
      if (!user) {
        throw new Error(
          `User could not be found with the id: ${userId} for validate OPT`
        );
      }
      if (user.accountLocked) {
        throw new Error(`Account is locked.`);
      }

      let isEmailValid = false;
      let isPhoneValid = false;

      const phone = await user.getDefaultPhoneModel();
      if (phone && phone.phone && phone.regionCode !== undefined) {
        isPhoneValid = await codeCache.validatePhoneOtp(
          code,
          phone.countryCode,
          phone.phone
        );
      }

      if (isPhoneValid) {
        return isPhoneValid;
      }

      const email = await user.getDefaultEmailModel();
      if (!email) {
        throw new Error(`No default email found.`);
      }

      isEmailValid = await codeCache.validateEmailOtp(code, email.email);

      return isEmailValid || isPhoneValid;
    } catch (err) {
      logger.logError(err.message);
    }

    return false;
  }
}

export type OtpServiceType = typeof OtpService.prototype;
