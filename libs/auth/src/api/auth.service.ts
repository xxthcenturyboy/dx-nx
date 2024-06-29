import zxcvbn from 'zxcvbn';
import { Op } from 'sequelize';

import {
  getUserProfileState,
  UserModel,
  UserModelType,
  UserProfileStateType
} from '@dx/user';
import { EmailModel } from '@dx/email';
import {
  PhoneModel,
  PHONE_DEFAULT_REGION_CODE
} from '@dx/phone';
import {
  AccountCreationPayloadType,
  LoginPaylodType,
  OtpLockoutResponseType,
  SessionData,
  SetupPasswordsPaylodType,
  SignupPayloadType,
  UserLookupQueryType,
  UserLookupResponseType
} from '../model/auth.types';
import {
  CLIENT_ROUTE,
  USER_LOOKUPS
} from '../model/auth.consts';
import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger';
import { MailSendgrid } from '@dx/mail';
import { ShortLinkModel } from '@dx/shortlink';
import {
  EmailUtil,
  PhoneUtil,
  ProfanityFilter
} from '@dx/utils';

export class AuthService {
  logger: ApiLoggingClassType;

  constructor() {
    this.logger = ApiLoggingClass.instance;
  }

  // TODO: replace with real vendor service
  private async validateOtpTemp(
    code: string,
    phone: string,
    countryCode: string
  ) {
    return new Promise<boolean>((resolve) => {
      resolve(
        !!(code && phone && countryCode)
      );
    });
  }

  public async createAccount(
    payload: AccountCreationPayloadType,
    session: SessionData
  ) {
    const {
      code,
      region,
      value
    } = payload;

    if (!value) {
      throw new Error('No data sent.');
    }

    if (!session) {
      throw new Error(`Internal server error: Missing Session.`);
    }

    let user: UserModelType;

    try {
      const phoneUtil = new PhoneUtil(value, region || PHONE_DEFAULT_REGION_CODE);
      if (
        code
        && phoneUtil.isValid
        && phoneUtil.countryCode
        && phoneUtil.nationalNumber
      ) {
        const isAvailable = await PhoneModel.isPhoneAvailable(phoneUtil.nationalNumber, phoneUtil.countryCode);
        if (!isAvailable) {
          throw new Error(`Phone is unavailable.`);
        }

        const isCodeValid = await this.validateOtpTemp(code, phoneUtil.nationalNumber, phoneUtil.countryCode);
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
          const isAvailable = await EmailModel.isEmailAvailable(emailUtil.formattedEmail());
          if (!isAvailable) {
            throw new Error(`Email is unavailable.`);
          }
          user = await UserModel.registerAndCreateFromEmail(emailUtil.formattedEmail());

          if (user) {
            const mail = new MailSendgrid();
            const inviteUrl = `/auth/z?route=validate&token=${user.token}`;
            const shortLink = await ShortLinkModel.generateShortlink(inviteUrl);
            try  {
              const inviteMessageId = await mail.sendInvite(emailUtil.formattedEmail(), shortLink);
              await EmailModel.updateMessageInfoValidate(emailUtil.formattedEmail(), inviteMessageId);
            } catch (err) {
              this.logger.logError(err.message);
            }
          }
        }
      }

      if (!user) {
        const message = `Account could not be created with payload: ${JSON.stringify(payload, null, 2)}`;
        throw new Error(message);
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
    const {
      code,
      region,
      type,
      value
    } = query;

    if (
      !type
      || !value
    ) {
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
        result.available = await EmailModel.isEmailAvailable(emailUtil.formattedEmail());
      }

      if (
        type === USER_LOOKUPS.PHONE
      ) {
        const phoneUtil = new PhoneUtil(value, region || PHONE_DEFAULT_REGION_CODE);
        if (!phoneUtil.isValid) {
          this.logger.logError(`invalid phone: ${value}, ${region || PHONE_DEFAULT_REGION_CODE}`);
          throw new Error('This phone cannot be used.');
        }
        result.available = await PhoneModel.isPhoneAvailable(phoneUtil.nationalNumber, phoneUtil.countryCode);
      }

      return result;
    } catch (err) {
      const message = `Error in auth lookup handler: ${err.message}`;
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async lockoutFromOtpEmail(id: string): Promise<OtpLockoutResponseType> {
    if (!id) {
      throw new Error('Request is invalid.');
    }

    try {
      await UserModel.lockoutOtp(id);

      const result: OtpLockoutResponseType = { locked: true };

      return result;
    } catch (err) {
      const message = `Error in OTP Lockout handler: ${err.message}`;
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async login(payload: LoginPaylodType): Promise<UserProfileStateType | void>  {
    const {
      biometric,
      code,
      region,
      password,
      value
    } = payload;

    if (!value) {
      throw new Error('No data sent.');
    }

    let user: UserModelType;

    try {
      // Phone Number Login
      const phoneUtil = new PhoneUtil(value, region || PHONE_DEFAULT_REGION_CODE);
      if (
        code
        && phoneUtil.isValid
        && phoneUtil.countryCode
        && phoneUtil.nationalNumber
      ) {
        const isCodeValid = await this.validateOtpTemp(code, phoneUtil.nationalNumber, phoneUtil.countryCode);
        if (isCodeValid) {
          const phone = await PhoneModel.findByPhoneAndCode(phoneUtil.nationalNumber, phoneUtil.countryCode);
          if (
            phone
            && phone.isVerified
            && phone.userId
          ) {
            user = await UserModel.findByPk(phone.userId);
          }
        }
      }

      // Email Login
      if (!user) {
        const emailUtil = new EmailUtil(value);
        if (emailUtil.validate()) {
          if (password) {
            user = await UserModel.loginWithPassword(emailUtil.formattedEmail(), password);
          }

          if (
            !user
            && !password
          ) {
            const email = await EmailModel.findByEmail(emailUtil.formattedEmail());
            if (
              email
              && email.userId
            ) {
              user = await UserModel.findByPk(email.userId);
            }
          }

        }
      }

      if (!user) {
        throw new Error('Could not log you in.');
      }

      if (
        user.deletedAt
        || user.accountLocked
      ) {
        this.logger.logError(`Attempted login by a locked account: ${JSON.stringify(user, null, 2)}`);
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
      const message = `Could not log in with payload: ${JSON.stringify(payload, null, 2)}`;
      this.logger.logError(message);
      throw new Error(err.message);
    }
  }

  public async requestReset(email: string) {
    if (!email) {
      throw new Error('Request is invalid.');
    }

    try {
      const emailUtil = new EmailUtil(email);
      if (!emailUtil.validate()) {
        if (emailUtil.isDisposableDomain()) {
          throw new Error('Invalid Domain');
        }

        throw new Error('Invalid Email');
      }

      const existingEmailRecord = await EmailModel.findOne({
        where: {
          email: emailUtil.formattedEmail(),
          deletedAt: null,
          verifiedAt: {
            [Op.ne]: null
          }
        }
      });

      if (!existingEmailRecord) {
        throw new Error(`Could not find ${email}.`);
      }

      const token = await UserModel.updateToken(existingEmailRecord.userId);

      if (!token) {
        throw new Error('No token created.');
      }

      const mail = new MailSendgrid();
      const inviteUrl = `/auth/z?route=${CLIENT_ROUTE.RESET}&token=${token}`;
      const shortLink = await ShortLinkModel.generateShortlink(inviteUrl);

      const resetMessageId = await mail.sendReset(emailUtil.formattedEmail(), shortLink);

      await EmailModel.updateMessageInfo(emailUtil.formattedEmail(), resetMessageId);

      return { success: true };

    } catch (err) {
      const message = `Error in reset request handler: ${err.message}`;
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async sendOtpToPhone(
    phone: string,
    region?: string
  ): Promise<boolean> {
    if (!phone) {
      throw new Error('No phone sent.');
    }

    try {
      const phoneUtil = new PhoneUtil(phone, region || PHONE_DEFAULT_REGION_CODE);
      if (phoneUtil.isValid) {
        // TODO: integrate with Twilio or other
        return new Promise((resolve) => {
          resolve(true);
        });
      }

      return false;
    } catch (err) {
      const message = err.message || 'Error sending Otp to phone' + phone;
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async setupPasswords(payload: SetupPasswordsPaylodType): Promise<UserProfileStateType | void>  {
    const {
      id,
      password,
      securityAA,
      securityQQ
    } = payload;

    if (
      !id
      && !password
      && !securityAA
      && !securityQQ
    ) {
      throw new Error('Request is invalid.');
    }

    try {
      await UserModel.setPassword(id, password, securityAA, securityQQ);

      const user = await UserModel.findByPk(id);
      await user.getPhones();
      await user.getEmails();
      const profile = await getUserProfileState(user, true);

      return profile;
    } catch (err) {
      const message = `Error in auth setup password: ${err.message}`;
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async signup(
    payload: SignupPayloadType,
    session: SessionData
  ): Promise<UserProfileStateType | void> {
    const {
      email,
      password,
      passwordConfirm,
      recaptcha,
      redirectUrl,
    } = payload;

    if (!email) {
      throw new Error(`Email is required.`);
    }

    if (password !== passwordConfirm) {
      throw new Error('Passwords must match.');
    }

    if (!session) {
      throw new Error(`Internal server error: Missing Session.`);
    }

    // Check password strength
    const pwStrength = zxcvbn(password);
    if (pwStrength.score < 3) {
      const pwStrengthMsg = `${pwStrength.feedback && pwStrength.feedback.warning && pwStrength.feedback.warning || ''}`;
      throw new Error(`Please choose a stronger password.
${pwStrengthMsg}
      `);
    }

    try {
      // const recaptchVerified = await recaptchaVerify(recaptcha);
      // if (!recaptchVerified) {
      //   throw new Error('Recaptcha failed.');
      // }

      const emailUtil = new EmailUtil(email);
      if (!emailUtil.validate()) {
        if (emailUtil.isDisposableDomain()) {
          this.logger.logWarn(`Signup - Disposable Email Domain: ${email}`);
        }
        this.logger.logWarn(`Signup - Invalid Email: ${email}`);
        throw new Error(`${email} does not appear to be a valid email.`);
      }

      const isAvailable = await EmailModel.isEmailAvailable(emailUtil.formattedEmail());
      if (!isAvailable) {
        throw new Error(`Email is unavailable.`);
      }

      const user = await UserModel.registerAndCreateFromEmail(emailUtil.formattedEmail());

      if (!user) {
        throw Error(`Failed to create user using email ${email}`);
      }

      await user.getEmails();
      await user.getPhones();
      const userProfile = await getUserProfileState(user, true);
      if (!userProfile) {
        throw Error(`Failed to build user profile.`);
      }

      return userProfile;
    } catch (err) {
      this.logger.logError(`Error in signup handler: ${err.message}`);
      throw new Error(err.message);
      // throw new Error('Unknown error. Please contact support.');
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
