import { ApiLoggingClass } from '@dx/logger';
import { OtpCodeCache } from '../model/otp-code.redis-cache';
import { UserModel } from '@dx/user';

export class OtpValidate {
  public static async validateOptCode(
    userId: string,
    code: string
  ): Promise<boolean> {
    if (
      !userId
      || !code
    ) {
      throw new Error('Insufficient data.');
    }
    const codeCache = new OtpCodeCache();
    const logger = ApiLoggingClass.instance;

    try {
      const user = await UserModel.findByPk(userId);
      if (!user) {
        throw new Error(`User could not be found with the id: ${userId}`);
      }
      if (user.accountLocked) {
        throw new Error(`Account is locked.`);
      }

      let isEmailValid = false;
      let isPhoneValid = false;

      const phone = await user.getDefaultPhoneModel();
      if (
        phone
        && phone.phone
        && phone.regionCode !== undefined
      ) {
        isPhoneValid = await codeCache.validatePhoneOtp(code, phone.phone, phone.regionCode);
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

export type OtpValidateType = typeof OtpValidate.prototype;
