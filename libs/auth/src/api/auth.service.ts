import zxcvbn from 'zxcvbn';

import {
  getUserProfileState,
  UserEmailModel,
  UserModel,
  UserPhoneModel,
  UserProfileStateType
} from '@dx/user';
import {
  GetByTokenQueryType,
  SessionData,
  SignupPayloadType,
  TokenConfirmationResponseType,
  UserLookupQueryType,
  UserLookupResponseType
} from '../model/auth.types';
import {
  USER_LOOKUPS
} from '../model/auth.consts';
import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger';

export class AuthService {
  logger: ApiLoggingClassType;

  constructor() {
    this.logger = ApiLoggingClass.instance;
  }

  public async doesEmailPhoneUsernameExist(query: UserLookupQueryType) {
    const {
      code,
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
        result.available = await UserEmailModel.isEmailAvailable(value);
      }

      if (
        type === USER_LOOKUPS.PHONE
        && code
      ) {
        result.available = await UserPhoneModel.isPhoneAvailable(value, code);
      }

      if (type === USER_LOOKUPS.USERNAME) {
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

      const isAvailable = await UserEmailModel.isEmailAvailable(email);
      if (!isAvailable) {
        throw new Error(`Email is already taken.`);
      }

      try {
        await UserEmailModel.assertEmailIsValid(email);
      } catch (err) {
        this.logger.logWarn(`Signup - Invalid Email: ${email}`);
        throw new Error(`${email} does not appear to be a valid email.`);
      }

      const user = await UserModel.registerAndCreateFromEmail(email, password);

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
