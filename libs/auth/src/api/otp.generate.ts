import { ApiLoggingClass } from '@dx/logger';
import { OtpCodeCache } from '../model/otp-code.redis-cache';
import { UserModel } from '@dx/user';

export class OtpGenerate {
  public static async generateOptCode(
    userId: string
  ): Promise<string> {
    const codeCache = new OtpCodeCache();
    const logger = ApiLoggingClass.instance;
    let otpCode: string;

    try {
      const user = await UserModel.findByPk(userId);
      if (!user) {
        throw new Error(`User could not be found with the id: ${userId}`);
      }
      if (user.accountLocked) {
        throw new Error(`Account is locked.`);
      }

      const phone = await user.getDefaultPhoneModel();
      if (
        phone
        && phone.phone
        && phone.countryCode
      ) {
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
}

export type OtpGenerateType = typeof OtpGenerate.prototype;
