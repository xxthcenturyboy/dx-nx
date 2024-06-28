import { Op } from 'sequelize';
import {
  FindOptions,
  IncludeOptions,
  WhereOptions
} from 'sequelize/types';

import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger';
import { UserModel, UserModelType } from '../model/user.postgres-model';
import { getUserProfileState } from './user-profile';
import {
  CreateUserPayloadType,
  CreateUserResponseType,
  GetUserProfileReturnType,
  GetUserListResponseType,
  GetUsersListQueryType,
  GetUserResponseType,
  OtpCodeResponseType,
  ResendInvitePayloadType,
  SendInviteResponseType,
  UserType,
  UpdateUserPayloadType,
  UpdateUserResponseType,
  UpdatePasswordPayloadType
} from '../model/user.types';
import {
  USER_FIND_ATTRIBUTES,
  USER_SORT_FIELDS
} from '../model/user.consts';
import { EMAIL_MODEL_OPTIONS } from '@dx/email';
import { PHONE_MODEL_OPTIONS } from '@dx/phone';
import {
  APP_DOMAIN,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  DEFAULT_SORT,
  isDebug,
  isLocal
} from '@dx/config';
import { ShortLinkModel } from '@dx/shortlink';
import { MailSendgrid } from '@dx/mail';
import { EmailModel } from '@dx/email';

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
    if (
      orderBy
      && USER_SORT_FIELDS.includes(orderBy)
    ) {
      return [
        [
          orderBy,
          sortDir || DEFAULT_SORT
        ]
      ];
    }

    return [
      [
        USER_SORT_FIELDS[0],
        DEFAULT_SORT
      ]
    ];
  }

  private getLikeFilter(filterValue: string): {[Op.iLike]: string} {
    return {
      [Op.iLike]: `%${filterValue}%`
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
          deletedAt: null
        }
      };
    }

    return {
      where: {
        deletedAt: null
      }
    };
  }

  public async createUser(payload: CreateUserPayloadType): Promise<CreateUserResponseType> {
    const {
      countryCode,
      email,
      username,
      firstName,
      lastName,
      phone,
      roles
    } = payload;

    if (
      !username
      || !email
    ) {
      throw new Error('Not enough information to create a user.');
    }

    try {
      const user = await UserModel.createFromUsername(
        username,
        email,
        roles,
        firstName,
        lastName,
        phone,
        countryCode
      );

      if (!user) {
        throw new Error('No user created.');
      }

      const mail = new MailSendgrid();
      const inviteUrl = `/auth/z?route=invite&token=${user.token}`;
      const shortLink = await ShortLinkModel.generateShortlink(inviteUrl);

      const inviteMessageId = await mail.sendInvite(email, shortLink);

      await EmailModel.updateMessageInfoValidate(email, inviteMessageId);

      return {
        id: user.id,
        invited: !!inviteMessageId
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
        userId: user.id
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
      profile: null
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

  public async getOtpCode(userId: string) {
    if (this.LOCAL) {
      const user = await UserModel.findByPk(userId);
      return user.otpCode;
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
          deletedAt: null
        },
        include: [EMAIL_MODEL_OPTIONS, PHONE_MODEL_OPTIONS],
        attributes: USER_FIND_ATTRIBUTES,
        logging: this.DEBUG && console.log
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

  public async getUserList(query: GetUsersListQueryType): Promise<GetUserListResponseType> {
    const {
      filterValue,
      limit,
      offset,
      orderBy,
      sortDir
    } = query;

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
        logging: this.DEBUG && console.log
      });

      if (!users) {
        throw new Error('Search for users failed');
      }

      const rows: UserType[] = [];
      for (const user of users.rows) {
        rows.push(user.toJSON());
      }
      users.rows = rows as UserModelType[];

      return users;
    } catch (err) {
      const message = err.message || 'Could not get user list.';
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async resendInvite(payload: ResendInvitePayloadType): Promise<SendInviteResponseType> {
    const {
      id,
      email
    } = payload;
    if (
      !id
      || !email
    ) {
      throw new Error('Request is invalid.');
    }

    try {
      if (!email.endsWith(`@${APP_DOMAIN}`)) {
        await EmailModel.assertEmailIsValid(email);
      }

      const token = await UserModel.updateToken(id);

      if (!token) {
        throw new Error('No token created.');
      }

      const mail = new MailSendgrid();
      const inviteUrl = `/auth/z?route=invite&token=${token}`;
      const shortLink = await ShortLinkModel.generateShortlink(inviteUrl);

      const inviteMessageId = await mail.sendInvite(email, shortLink);

      await EmailModel.updateMessageInfoValidate(email, inviteMessageId);

      return {
        invited: !!inviteMessageId
      };
    } catch (err) {
      const message = err.message || 'Could not send invite.';
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async sendOtpCode(userId: string): Promise<OtpCodeResponseType> {
    if (!userId) {
      throw new Error('Request is invalid.');
    }

    try {
      const user = await UserModel.findByPk(userId) as UserModel;

      if (!user) {
        throw new Error('No user for this id.');
      }

      if (user.accountLocked) {
        throw new Error(`Account is locked.`);
      }

      const email = await user.getVerifiedEmail();
      if (!email) {
        throw new Error(`No verified email found.`);
      }

      const otpCode = await UserModel.updateOtpCode(userId);

      const mail = new MailSendgrid();
      const inviteUrl = `/auth/z?route=otp-lock&id=${userId}`;
      const shortLink = await ShortLinkModel.generateShortlink(inviteUrl);

      const otpMessageId = await mail.sendOtp(email, otpCode, shortLink);

      await EmailModel.updateMessageInfoValidate(email, otpMessageId);

      return {
        codeSent: !!otpMessageId
      };
    } catch (err) {
      const message = err.message || 'Could not send code.';
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async updatePassword(payload: UpdatePasswordPayloadType) {
    const {
      id,
      password,
      oldPassword,
      otpCode
    } = payload;

    if (
      !id
      || !password
      || !oldPassword
      || !otpCode
    ) {
      throw new Error('Request is invalid.');
    }

    try {
      const didUpdate = await UserModel.updatePassword(id, password, oldPassword, otpCode);
      const result = { success: didUpdate };

      return result;
    } catch (err) {
      const message = err.message || 'Could not update password.';
      this.logger.logError(message);
      throw new Error(message);
    }
  }

  public async updateUser(
    id: string,
    payload: UpdateUserPayloadType
  ): Promise<UpdateUserResponseType> {
    const {
      firstName,
      lastName,
      restrictions,
      roles,
    } = payload;

    if (!id) {
      throw new Error('No id for update user.');
    }

    try {
      const user = await UserModel.findByPk(id);

      if (!user) {
        throw new Error(`User could not be found with the id: ${id}`);
      }

      if (firstName !== undefined && typeof firstName === 'string') {
        user.setDataValue('firstName', firstName);
      }
      if (lastName !== undefined && typeof lastName === 'string') {
        user.setDataValue('lastName', lastName);
      }
      if (restrictions !== undefined && Array.isArray(restrictions)) {
        user.setDataValue('restrictions', restrictions);
      }
      if (roles !== undefined && Array.isArray(roles)) {
        user.setDataValue('roles', roles);
      }

      await user.save();

      return {
        userId: user.id
      };
    } catch (err) {
      const message = err.message || 'Could not update user.';
      this.logger.logError(message);
      throw new Error(message);
    }
  }
}

export type UserServiceType = typeof UserService.prototype;
