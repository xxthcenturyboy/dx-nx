import zxcvbn from 'zxcvbn';
import { Op } from 'sequelize';
import { FindOptions, WhereOptions } from 'sequelize/types';

import { ApiLoggingClass, ApiLoggingClassType } from '@dx/logger-api';
import { EMAIL_MODEL_OPTIONS } from '@dx/email-api';
import { PHONE_MODEL_OPTIONS } from '@dx/phone-api';
import {
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  DEFAULT_SORT,
  PHONE_DEFAULT_REGION_CODE,
} from '@dx/config-shared';
import { isDebug, isLocal, isProd } from '@dx/config-api';
import { ShortLinkModel } from '@dx/shortlink-api';
import { MailSendgrid } from '@dx/mail-api';
import { EmailModel } from '@dx/email-api';
import { EmailUtil } from '@dx/utils/api/emails';
import { PhoneUtil } from '@dx/util-phones';
import { ProfanityFilter } from '@dx/utils/api/profanity';
import { OtpResponseType } from '@dx/auth-shared';
import { OtpService } from '@dx/auth-api';
import { dxRsaValidateBiometricKey } from '@dx/util-encryption';
import { UserModel } from './user.postgres-model';
import { getUserProfileState } from './user-profile';
import {
  CreateUserResponseType,
  GetUserProfileReturnType,
  GetUserListResponseType,
  GetUsersListQueryType,
  GetUserResponseType,
  UserType,
  UpdateUserPayloadType,
  UpdateUsernamePayloadType,
  UpdateUserResponseType,
  UpdatePasswordPayloadType,
} from './user.types';
import { USER_FIND_ATTRIBUTES, USER_SORT_FIELDS } from './user.consts';
import { CreateUserPayloadType } from '@dx/user-shared';

export class UserService {
  private DEBUG = isDebug();
  private LOCAL = isLocal();
  private logger: ApiLoggingClassType;

  constructor() {
    this.logger = ApiLoggingClass.instance;
  }

  private getSortListOptions(
    orderBy?: string,
    sortDir?: string
  ): FindOptions['order'] {
    if (orderBy && USER_SORT_FIELDS.includes(orderBy)) {
      return [[orderBy, sortDir || DEFAULT_SORT]];
    }

    return [[USER_SORT_FIELDS[0], DEFAULT_SORT]];
  }

  private getLikeFilter(filterValue: string): { [Op.iLike]: string } {
    return {
      [Op.iLike]: `%${filterValue}%`,
    };
  }

  private getListSearchQuery(filterValue?: string): WhereOptions {
    if (filterValue) {
      const likeFilter = this.getLikeFilter(filterValue);

      return {
        where: {
          [Op.or]: {
            '$emails.email$': likeFilter,
            '$phones.phone$': likeFilter,
            firstName: likeFilter,
            lastName: likeFilter,
            username: likeFilter,
          },
          deletedAt: null,
        },
      };
    }

    return {
      where: {
        deletedAt: null,
      },
    };
  }

  public async createUser(
    payload: CreateUserPayloadType
  ): Promise<CreateUserResponseType> {
    const {
      countryCode,
      regionCode,
      email,
      username,
      firstName,
      lastName,
      phone,
      roles,
      isTest,
    } = payload;

    if (!username || !email) {
      throw new Error('Not enough information to create a user.');
    }

    const profanityFilter = new ProfanityFilter();
    if (profanityFilter.isProfane(username)) {
      throw new Error('Profane usernames are not allowed.');
    }

    const emailUtil = new EmailUtil(email);
    if (!emailUtil.validate()) {
      throw new Error('Invalid Email');
    }

    let phoneValue: string;
    let countryCodeValue: string = countryCode;
    if (phone) {
      const phoneUtil = new PhoneUtil(
        phone,
        regionCode || PHONE_DEFAULT_REGION_CODE
      );
      if (!phoneUtil.isValid) {
        throw new Error('Invalid Phone');
      }
      countryCodeValue = phoneUtil.countryCode;
      phoneValue = phoneUtil.nationalNumber;
    }

    try {
      const user = await UserModel.createFromUsername(
        username,
        emailUtil.formattedEmail(),
        roles,
        firstName,
        lastName,
        phoneValue,
        countryCodeValue,
        regionCode || PHONE_DEFAULT_REGION_CODE,
        isTest
      );

      if (!user) {
        throw new Error('No user created.');
      }

      const mail = new MailSendgrid();
      const inviteUrl = `/auth/z?route=invite&token=${user.token}`;
      const shortLink = await ShortLinkModel.generateShortlink(inviteUrl);

      try {
        const inviteMessageId = await mail.sendInvite(
          emailUtil.formattedEmail(),
          shortLink
        );
        await EmailModel.updateMessageInfoValidate(
          emailUtil.formattedEmail(),
          inviteMessageId
        );
        return {
          id: user.id,
          invited: !!inviteMessageId,
        };
      } catch (err) {
        this.logger.logError(err.message);
      }

      return {
        id: user.id,
        invited: false,
      };
    } catch (err) {
      const message = err.message || 'Could not create user.';
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async deleteUser(id: string) {
    if (!id) {
      throw new Error('No id for delete user.');
    }

    try {
      const user = await UserModel.findByPk(id);

      if (!user) {
        throw new Error(`User could not be found with the id: ${id}`);
      }

      user.setDataValue('deletedAt', new Date());
      await user.save();

      return {
        userId: user.id,
      };
    } catch (err) {
      const message = err.message || 'Could not delete user.';
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async deleteTestUser(id: string) {
    if (this.LOCAL) {
      await UserModel.removeUser(id);
    }
  }

  public async getProfile(userId: string) {
    const profile: GetUserProfileReturnType = {
      profile: null,
    };

    if (!userId) {
      return profile;
    }

    try {
      const user = await UserModel.findByPk(userId);

      if (!user) {
        return profile;
      }

      await user.getEmails();
      await user.getPhones();
      profile.profile = await getUserProfileState(user, true);

      return profile;
    } catch (err) {
      const message = err.message || 'Could not get user profile';
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async getUser(id: string): Promise<GetUserResponseType> {
    if (!id) {
      throw new Error('No id provided searching users.');
    }

    try {
      const user = await UserModel.findOne({
        where: {
          id,
          deletedAt: null,
        },
        include: [EMAIL_MODEL_OPTIONS, PHONE_MODEL_OPTIONS],
        attributes: USER_FIND_ATTRIBUTES,
        logging: this.DEBUG && console.log,
      });

      if (!user) {
        throw new Error('Search for user failed.');
      }

      return user.toJSON();
    } catch (err) {
      const message = err.message || 'Could not get user.';
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async getUserList(
    query: GetUsersListQueryType
  ): Promise<GetUserListResponseType> {
    const { filterValue, limit, offset, orderBy, sortDir } = query;

    const orderArgs = this.getSortListOptions(orderBy, sortDir);

    const search = this.getListSearchQuery(filterValue);

    try {
      const users = await UserModel.findAndCountAll({
        include: [EMAIL_MODEL_OPTIONS, PHONE_MODEL_OPTIONS],
        ...search,
        subQuery: false,
        limit: limit ? Number(limit) : DEFAULT_LIMIT,
        offset: offset ? Number(offset) : DEFAULT_OFFSET,
        order: orderArgs,
        attributes: USER_FIND_ATTRIBUTES,
        logging: this.DEBUG && console.log,
      });

      if (!users) {
        throw new Error('Search for users failed');
      }

      const rows: UserType[] = [];
      for (const user of users.rows) {
        rows.push(user.toJSON());
      }
      // @ts-expect-error - types are ok
      users.rows = rows;
      return users;
    } catch (err) {
      const message = err.message || 'Could not get user list.';
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async isUsernameAvailable(usernameToCheck: string) {
    if (!usernameToCheck) {
      throw new Error('Nothing to check.');
    }

    const result = { available: false };

    const profanityUtil = new ProfanityFilter();
    if (profanityUtil.isProfane(usernameToCheck)) {
      throw new Error('Profanity is not allowed');
    }
    try {
      result.available = await UserModel.isUsernameAvailable(usernameToCheck);
    } catch (err) {
      const message = err.message || 'Error checking for username availability';
      this.logger.logError(message);
      throw new Error(message);
    }

    return result;
  }

  // public async resendInvite(payload: ResendInvitePayloadType): Promise<SendInviteResponseType> {
  //   const {
  //     id,
  //     email
  //   } = payload;
  //   if (
  //     !id
  //     || !email
  //   ) {
  //     throw new Error('Request is invalid.');
  //   }

  //   const emailUtil = new EmailUtil(email);

  //   try {
  //     if (!emailUtil.validate()) {
  //       if (emailUtil.isDisposableDomain()) {
  //         throw new Error('The email you provided is not valid. Please note that we do not allow disposable emails or emails that do not exist, so make sure to use a real email address.');
  //       }

  //       throw new Error('The email you provided is not valid.');
  //     }

  //     const token = await UserModel.updateToken(id);

  //     if (!token) {
  //       throw new Error('No token created.');
  //     }

  //     const mail = new MailSendgrid();
  //     const inviteUrl = `/auth/z?route=invite&token=${token}`;
  //     const shortLink = await ShortLinkModel.generateShortlink(inviteUrl);

  //     const inviteMessageId = await mail.sendInvite(emailUtil.formattedEmail(), shortLink);

  //     await EmailModel.updateMessageInfoValidate(emailUtil.formattedEmail(), inviteMessageId);

  //     return {
  //       invited: !!inviteMessageId
  //     };
  //   } catch (err) {
  //     const message = err.message || 'Could not send invite.';
  //     this.logger.logError(message);
  //     throw new Error(message);
  //   }
  // }

  public async sendOtpCode(userId: string): Promise<OtpResponseType> {
    if (!userId) {
      throw new Error('Request is invalid.');
    }

    try {
      const code = await OtpService.generateOptCode(userId);
      return isProd() ? { code: '' } : { code };
    } catch (err) {
      const message = err.message || 'Could not send code.';
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async updatePassword(payload: UpdatePasswordPayloadType) {
    const { id, password, passwordConfirm, otpCode, signature } = payload;

    if (!id || !password || !passwordConfirm || !(otpCode || signature)) {
      throw new Error('Request is invalid.');
    }

    if (password !== passwordConfirm) {
      throw new Error('Passwords must match.');
    }

    if (otpCode) {
      const isCodeValid = await OtpService.validateOptCode(id, otpCode);
      if (!isCodeValid) {
        throw new Error('Invalid OTP code.');
      }
    }

    if (signature) {
      const biometricAuthPublicKey = await UserModel.getBiomAuthKey(id);
      const isSignatureValid = dxRsaValidateBiometricKey(
        signature,
        password,
        biometricAuthPublicKey
      );
      if (!isSignatureValid) {
        throw new Error(
          `Update Password: Device signature is invalid: ${biometricAuthPublicKey}, userid: ${id}`
        );
      }
    }

    // Check password strength
    const pwStrength = zxcvbn(password);
    if (pwStrength.score < 3) {
      const pwStrengthMsg = `${
        (pwStrength.feedback &&
          pwStrength.feedback.warning &&
          pwStrength.feedback.warning) ||
        ''
      }`;
      throw new Error(`Please choose a stronger password.
${pwStrengthMsg}
      `);
    }

    try {
      const didUpdate = await UserModel.updatePassword(id, password);
      const result = { success: didUpdate };

      return result;
    } catch (err) {
      const message = err.message || 'Could not update password.';
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async updateRolesAndRestrictions(
    id: string,
    payload: UpdateUserPayloadType
  ): Promise<UpdateUserResponseType> {
    const { restrictions, roles } = payload;

    if (!id) {
      throw new Error('No id for update user.');
    }

    try {
      const user = await UserModel.findByPk(id);

      if (!user) {
        throw new Error(`User could not be found with the id: ${id}`);
      }

      if (restrictions !== undefined && Array.isArray(restrictions)) {
        user.setDataValue('restrictions', restrictions);
      }
      if (roles !== undefined && Array.isArray(roles)) {
        user.setDataValue('roles', roles);
      }

      await user.save();

      return {
        userId: user.id,
      };
    } catch (err) {
      const message = err.message || 'Could not update user.';
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async updateUser(
    id: string,
    payload: UpdateUserPayloadType
  ): Promise<UpdateUserResponseType> {
    const { firstName, lastName } = payload;

    if (!id) {
      throw new Error('No id for update user.');
    }

    try {
      const user = await UserModel.findByPk(id);

      if (!user) {
        throw new Error(`User could not be found with the id: ${id}`);
      }

      const profanityFilter = new ProfanityFilter();

      if (firstName !== undefined && typeof firstName === 'string') {
        if (profanityFilter.isProfane(firstName)) {
          user.setDataValue(
            'firstName',
            profanityFilter.cleanProfanity(firstName)
          );
        }
        user.setDataValue('firstName', firstName);
      }
      if (lastName !== undefined && typeof lastName === 'string') {
        if (profanityFilter.isProfane(lastName)) {
          user.setDataValue(
            'lastName',
            profanityFilter.cleanProfanity(lastName)
          );
        }
        user.setDataValue('lastName', lastName);
      }

      await user.save();

      return {
        userId: user.id,
      };
    } catch (err) {
      const message = err.message || 'Could not update user.';
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async updateUserName(
    id: string,
    payload: UpdateUsernamePayloadType
  ): Promise<UpdateUserResponseType> {
    const { otpCode, signature, username } = payload;

    if (!id) {
      throw new Error('No id for update username.');
    }

    if (otpCode) {
      const isCodeValid = await OtpService.validateOptCode(id, otpCode);
      if (!isCodeValid) {
        throw new Error('Invalid OTP code.');
      }
    }

    if (signature) {
      const biometricAuthPublicKey = await UserModel.getBiomAuthKey(id);
      const isSignatureValid = dxRsaValidateBiometricKey(
        signature,
        username,
        biometricAuthPublicKey
      );
      if (!isSignatureValid) {
        throw new Error(
          `Update Username: Device signature is invalid: ${biometricAuthPublicKey}, userid: ${id}`
        );
      }
    }

    const isAvailable = await this.isUsernameAvailable(username);
    if (!isAvailable.available) {
      throw new Error('Username is not available.');
    }

    const profanityUtil = new ProfanityFilter();
    if (profanityUtil.isProfane(username)) {
      throw new Error('Profanity is not allowed');
    }

    try {
      const user = await UserModel.findByPk(id);

      if (!user) {
        throw new Error(`User could not be found with the id: ${id}`);
      }

      user.setDataValue('username', username);

      await user.save();

      return {
        userId: user.id,
      };
    } catch (err) {
      const message = err.message || 'Could not update username.';
      this.logger.logError(message);
      throw new Error(message);
    }
  }
}

export type UserServiceType = typeof UserService.prototype;
