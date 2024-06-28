import zxcvbn from 'zxcvbn';
import { Op } from 'sequelize';

import {
  getUserProfileState,
  UserModel,
  UserProfileStateType
} from '@dx/user';
import { EmailModel } from '@dx/email';
import {
  PhoneModel,
  PHONE_DEFAULT_REGION_CODE
} from '@dx/phone';
import {
  GetByTokenQueryType,
  LoginPaylodType,
  OtpLockoutResponseType,
  SessionData,
  SetupPasswordsPaylodType,
  SignupPayloadType,
  TokenConfirmationResponseType,
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

  public async doesEmailPhoneUsernameExist(query: UserLookupQueryType) {
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
        && code
      ) {
        const phoneUtil = new PhoneUtil(value, region || PHONE_DEFAULT_REGION_CODE);
        if ( !phoneUtil.isValid) {
          this.logger.logError(`invalid phone: ${value}, ${region || PHONE_DEFAULT_REGION_CODE}`);
          throw new Error('This phone cannot be used.');
        }
        result.available = await PhoneModel.isPhoneAvailable(phoneUtil.nationalNumber, code);
      }

      if (type === USER_LOOKUPS.USERNAME) {
        const profanityUtil = new ProfanityFilter();
        if (profanityUtil.isProfane(value)) {
          throw new Error('Profanity is not allowed');
        }
        result.available = await UserModel.isUsernameAvailable(value);
      }

      return result;
    } catch (err) {
      const message = `Error in auth lookup handler: ${err.message}`;
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async getByToken(query: GetByTokenQueryType) {
    const { token } = query;
    if (!token) {
      throw new Error('Incorrect query parameters.');
    }

    try {
      const user = await UserModel.getByToken(token);
      const result: TokenConfirmationResponseType = {
        id: user.id,
        email: user?.emails[0]?.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
      };

      return result;
    } catch (err) {
      const message = `Error in auth get user by token handler: ${err.message}`;
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

  public async login(paylod: LoginPaylodType): Promise<UserProfileStateType | void>  {
    const {
      email,
      password
    } = paylod;

    const emailDoesNotExist = await EmailModel.isEmailAvailable(email);
    if (emailDoesNotExist) {
      throw new Error(`This is not a valid username.`);
    }

    let user: UserModel | null;
    try {
      // Attempt login
      user = await UserModel.loginWithPassword(email, password);
    } catch (err) {
      throw new Error(err.message);
    }

    if (!user) {
      throw new Error('Incorrect username or password.');
    }

    await user.getEmails();
    await user.getPhones();
    const userProfile = await getUserProfileState(user, true);
    if (!userProfile) {
      throw Error(`Failed to build user profile.`);
    }

    return userProfile;
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

  public async setupPasswords(paylod: SetupPasswordsPaylodType): Promise<UserProfileStateType | void>  {
    const {
      id,
      password,
      securityAA,
      securityQQ
    } = paylod;

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
        throw new Error(`Email is already taken.`);
      }

      const user = await UserModel.registerAndCreateFromEmail(emailUtil.formattedEmail(), password);

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
}

export type AuthServiceType = typeof AuthService.prototype;
