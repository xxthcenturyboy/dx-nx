import { randomUUID } from 'crypto';

import {
  getUserProfileState,
  UserModel,
  UserModelType,
  UserProfileStateType,
} from '@dx/user-api';
import { DeviceModel } from '@dx/devices-api';
import { EmailModel } from '@dx/email-api';
import { PhoneModel } from '@dx/phone-api';
import { ApiLoggingClass, ApiLoggingClassType } from '@dx/logger-api';
import { MailSendgrid } from '@dx/mail-api';
import { ShortLinkModel } from '@dx/shortlink-api';
import { EmailUtil } from '@dx/utils/api/emails';
import { PhoneUtil } from '@dx/util-phones';
import { dxRsaValidateBiometricKey } from '@dx/util-encryption';
import { isProd } from '@dx/config-api';
import { PHONE_DEFAULT_REGION_CODE } from '@dx/config-shared';
import { DevicesService } from '@dx/devices-api';
import {
  AccountCreationPayloadType,
  BiometricAuthType,
  LoginPaylodType,
  // SessionData,
  UserLookupQueryType,
  UserLookupResponseType,
} from './auth-api.types';
import { USER_LOOKUPS } from './auth-api.consts';
import { OtpCodeCache } from './otp-code.redis-cache';
import { TokenService } from './token.service';

export class AuthService {
  logger: ApiLoggingClassType;

  constructor() {
    this.logger = ApiLoggingClass.instance;
  }

  public async createAccount(
    payload: AccountCreationPayloadType
    // session: SessionData
  ) {
    const { code, device, region, value } = payload;

    if (!value || !code) {
      throw new Error('Bad data sent.');
    }

    // if (!session) {
    //   throw new Error(`Internal server error: Missing Session.`);
    // }

    let user: UserModelType;

    try {
      const phoneUtil = new PhoneUtil(
        value,
        region || PHONE_DEFAULT_REGION_CODE
      );
      if (
        phoneUtil.isValid &&
        phoneUtil.countryCode &&
        phoneUtil.nationalNumber
      ) {
        if (!phoneUtil.isValidMobile) {
          throw new Error(
            'This phone number cannot be used to create an account.'
          );
        }

        const isAvailable = await PhoneModel.isPhoneAvailable(
          phoneUtil.nationalNumber,
          phoneUtil.countryCode
        );
        if (!isAvailable) {
          throw new Error(`Phone is unavailable.`);
        }

        const otpCache = new OtpCodeCache();
        const isCodeValid = await otpCache.validatePhoneOtp(
          code,
          phoneUtil.countryCode,
          phoneUtil.nationalNumber
        );
        if (isCodeValid) {
          user = await UserModel.registerAndCreateFromPhone(
            phoneUtil.nationalNumber,
            phoneUtil.countryCode,
            region || PHONE_DEFAULT_REGION_CODE
          );
        }
      }

      if (!user) {
        const emailUtil = new EmailUtil(value);
        if (emailUtil.validate()) {
          const isAvailable = await EmailModel.isEmailAvailable(
            emailUtil.formattedEmail()
          );
          if (!isAvailable) {
            throw new Error(`Email is unavailable.`);
          }
          const otpCache = new OtpCodeCache();
          const isCodeValid = await otpCache.validateEmailOtp(
            code,
            emailUtil.formattedEmail()
          );
          if (isCodeValid) {
            user = await UserModel.registerAndCreateFromEmail(
              emailUtil.formattedEmail(),
              true
            );

            if (user) {
              const mail = new MailSendgrid();
              const inviteUrl = `/auth/z?route=validate&token=${user.token}`;
              const shortLink = await ShortLinkModel.generateShortlink(
                inviteUrl
              );
              try {
                const inviteMessageId = await mail.sendConfirmation(
                  emailUtil.formattedEmail(),
                  shortLink
                );
                await EmailModel.updateMessageInfoValidate(
                  emailUtil.formattedEmail(),
                  inviteMessageId
                );
              } catch (err) {
                this.logger.logError(err.message);
              }
            }
          }
        }
      }

      if (!user) {
        const message = `Account could not be created with payload: ${JSON.stringify(
          payload,
          null,
          2
        )}`;
        throw new Error(message);
      }

      if (device && device.uniqueDeviceId) {
        const existingDevice = await DeviceModel.findOne({
          where: {
            uniqueDeviceId: device.uniqueDeviceId,
            deletedAt: null,
          },
        });

        // Device is used but connected to another user => transfer over
        if (existingDevice && existingDevice.userId !== user.id) {
          existingDevice.deletedAt = new Date();
          await existingDevice.save();
        }

        await DeviceModel.create({
          ...device,
          userId: user.id,
          verifiedAt: new Date(),
          verificationToken: randomUUID(),
        });
      }

      await user.getEmails();
      await user.getPhones();
      const userProfile = await getUserProfileState(user, true);
      if (!userProfile) {
        throw Error(`Failed to build user profile.`);
      }

      return userProfile;
    } catch (err) {
      const message = err.message || 'Could not create account.';
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async doesEmailPhoneExist(query: UserLookupQueryType) {
    const { code, region, type, value } = query;

    if (!type || !value) {
      throw new Error('Incorrect query parameters.');
    }

    const result: UserLookupResponseType = { available: false };

    try {
      if (type === USER_LOOKUPS.EMAIL) {
        const emailUtil = new EmailUtil(value);
        if (!emailUtil.validate()) {
          if (emailUtil.isDisposableDomain()) {
            throw new Error('Invalid email domain.');
          }
          throw new Error('Invalid Email.');
        }
        result.available = await EmailModel.isEmailAvailable(
          emailUtil.formattedEmail()
        );
      }

      if (type === USER_LOOKUPS.PHONE) {
        const phoneUtil = new PhoneUtil(
          value,
          region || PHONE_DEFAULT_REGION_CODE
        );
        if (!phoneUtil.isValid) {
          this.logger.logError(
            `invalid phone: ${value}, ${region || PHONE_DEFAULT_REGION_CODE}`
          );
          throw new Error('This phone cannot be used.');
        }
        result.available = await PhoneModel.isPhoneAvailable(
          phoneUtil.nationalNumber,
          phoneUtil.countryCode
        );
      }

      return result;
    } catch (err) {
      const message = `Error in auth lookup handler: ${err.message}`;
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async biometricLogin(data: BiometricAuthType) {
    const { signature, payload, userId, device } = data;
    if (!userId || !signature || !payload) {
      throw new Error('Insufficient data for Biometric login.');
    }

    try {
      const biometricAuthPublicKey = await UserModel.getBiomAuthKey(userId);
      if (!biometricAuthPublicKey) {
        throw new Error(
          `BiometricLogin: User ${userId} has no stored public key.`
        );
      }

      const isSignatureValid = dxRsaValidateBiometricKey(
        signature,
        payload,
        biometricAuthPublicKey
      );
      if (!isSignatureValid) {
        throw new Error(
          `BiometricLogin: Device signature is invalid: ${biometricAuthPublicKey}, userid: ${userId}`
        );
      }

      const user = await UserModel.findByPk(userId);
      if (!user) {
        throw new Error(`BiometricLogin: No user with that id: ${userId}`);
      }

      if (device) {
        const deviceService = new DevicesService();
        await deviceService.handleDevice(device, user);
      }

      return user;
    } catch (err) {
      this.logger.logError(err);
      throw new Error(err.message || 'Biometric Login Faield.');
    }
  }

  public async login(
    payload: LoginPaylodType
  ): Promise<UserProfileStateType | void> {
    const { biometric, code, region, password, value } = payload;

    if (!value) {
      throw new Error('No data sent.');
    }

    let user: UserModelType;

    try {
      // Authentication in order of preference
      // Biometric Login
      if (biometric && biometric.userId && biometric.signature) {
        user = await this.biometricLogin({
          ...biometric,
          payload: value,
        });
      }

      // Phone Number Login
      if (!user) {
        const phoneUtil = new PhoneUtil(
          value,
          region || PHONE_DEFAULT_REGION_CODE
        );
        if (
          code &&
          phoneUtil.isValid &&
          phoneUtil.countryCode &&
          phoneUtil.nationalNumber
        ) {
          const otpCache = new OtpCodeCache();
          const isCodeValid = await otpCache.validatePhoneOtp(
            code,
            phoneUtil.countryCode,
            phoneUtil.nationalNumber
          );
          if (isCodeValid) {
            const phone = await PhoneModel.findByPhoneAndCode(
              phoneUtil.nationalNumber,
              phoneUtil.countryCode
            );
            if (phone && phone.isVerified && phone.userId) {
              user = await UserModel.findByPk(phone.userId);
            }
          }
        }
      }

      // Email Login
      if (!user) {
        const emailUtil = new EmailUtil(value);
        if (emailUtil.validate()) {
          if (password) {
            user = await UserModel.loginWithPassword(
              emailUtil.formattedEmail(),
              password
            );
          }

          if (!user && !password && code) {
            const otpCache = new OtpCodeCache();
            const isCodeValid = await otpCache.validateEmailOtp(
              code,
              emailUtil.formattedEmail()
            );
            if (isCodeValid) {
              const email = await EmailModel.findByEmail(
                emailUtil.formattedEmail()
              );
              if (email && email.userId) {
                user = await UserModel.findByPk(email.userId);
              }
            }
          }
        }
      }

      if (!user) {
        throw new Error('Could not log you in.');
      }

      if (user.deletedAt || user.accountLocked) {
        this.logger.logError(
          `Attempted login by a locked account: ${JSON.stringify(
            user,
            null,
            2
          )}`
        );
        throw new Error('Could not log you in.');
      }

      await user.getEmails();
      await user.getPhones();
      const userProfile = await getUserProfileState(user, true);
      if (!userProfile) {
        throw Error(`Failed to build user profile.`);
      }

      return userProfile;
    } catch (err) {
      const message = `Could not log in with payload: ${JSON.stringify(
        payload,
        null,
        2
      )}`;
      this.logger.logError(message);
      throw new Error(err.message);
    }
  }

  public async logout(refreshToken: string): Promise<boolean> {
    try {
      const user = await UserModel.getByRefreshToken(refreshToken);
      if (!user) {
        return false;
      }

      const refreshTokens = user.refreshTokens.filter(
        (token) => token !== refreshToken
      );
      const userId = TokenService.getUserIdFromToken(refreshToken);
      const updated = await UserModel.updateRefreshToken(userId, refreshTokens);
      return updated;
    } catch (err) {
      this.logger.logError(err);
    }

    return false;
  }

  public async sendOtpToEmail(email: string): Promise<{ code: string }> {
    if (!email) {
      throw new Error('No email sent.');
    }

    let otpCode: string;
    try {
      const emailUtil = new EmailUtil(email);
      if (emailUtil.validate()) {
        const otpCache = new OtpCodeCache();
        otpCode = await otpCache.setEmailOtp(emailUtil.formattedEmail());
        const mail = new MailSendgrid();
        try {
          const sgMessageId = await mail.sendOtp(
            emailUtil.formattedEmail(),
            otpCode
          );
          await EmailModel.updateMessageInfoValidate(
            emailUtil.formattedEmail(),
            sgMessageId
          );
        } catch (err) {
          this.logger.logError(err.message);
        }
      }

      return isProd() ? { code: '' } : { code: otpCode };
    } catch (err) {
      const message = err.message || 'Error sending Otp to email' + email;
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async sendOtpToPhone(
    phone: string,
    region?: string
  ): Promise<{ code: string }> {
    if (!phone) {
      throw new Error('No phone sent.');
    }

    let otpCode: string;

    try {
      const phoneUtil = new PhoneUtil(
        phone,
        region || PHONE_DEFAULT_REGION_CODE
      );
      if (phoneUtil.isValid) {
        const otpCache = new OtpCodeCache();
        otpCode = await otpCache.setPhoneOtp(
          phoneUtil.countryCode,
          phoneUtil.nationalNumber
        );
        // TODO: integrate with Twilio or other to send SMS
      }

      return isProd() ? { code: '' } : { code: otpCode };
    } catch (err) {
      const message = err.message || 'Error sending Otp to phone' + phone;
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async validateEmail(token: string) {
    if (!token) {
      throw new Error('No token to validate.');
    }

    try {
      const email = await EmailModel.validateEmailWithToken(token);

      return email.toJSON();
    } catch (err) {
      const message = err.message || 'Could not verify email';
      this.logger.logError(message);
      throw new Error(message);
    }
  }
}

export type AuthServiceType = typeof AuthService.prototype;
