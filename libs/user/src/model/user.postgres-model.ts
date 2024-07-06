import {
  col,
  fn,
  literal,
  Op
} from 'sequelize';
import {
  BelongsTo,
  Table,
  Column,
  Model,
  DataType,
  Default,
  ForeignKey,
  PrimaryKey,
  AllowNull,
  Unique,
  HasMany,
  Is
} from 'sequelize-typescript';
import { maxBy } from 'lodash';

import {
  dxEncryptionGenerateRandomValue,
  dxEncryptionHashString,
  dxEncryptionVerifyHash,
  DxDateUtilClass
} from '@dx/utils';
import {
  EmailModel,
  EmailModelType,
  EmailType
} from '@dx/email';
import {
  PhoneModel,
  PhoneModelType,
  PhoneType
} from '@dx/phone';
import {
  DeviceModel,
  DeviceModelType,
  DeviceType
} from '@dx/devices';
import {
  UserPrivilegeSetModel,
  UserPrivilegeSetModelType
} from './user-privilege.postgres-model';
import {
  ACCOUNT_RESTRICTIONS,
  USER_ENTITY_POSTGRES_DB_NAME,
  USER_ROLE
} from './user.consts';
import { usernameValidator } from '../api/username.validator';
import { ApiLoggingClass } from '@dx/logger';
import { UserSessionType } from './user.types';

@Table({
  modelName: USER_ENTITY_POSTGRES_DB_NAME,
  indexes: [],
  underscored: true,
})

export class UserModel extends Model<UserModel> {
  @PrimaryKey
  @Default(fn('uuid_generate_v4'))
  @AllowNull(false)
  @Column(DataType.UUID)
  id: string;

  @HasMany(() => DeviceModel)
  devices: DeviceModel[];

  @HasMany(() => EmailModel)
  emails: EmailModel[];

  @HasMany(() => PhoneModel)
  phones: PhoneModel[];

  @HasMany(() => UserModel, 'referrer_user_id')
  referredUsers: UserModel[];

  @Column({ field: 'hashword', type: DataType.STRING })
  hashword: string;

  @Column({ field: 'first_name', type: DataType.STRING })
  firstName: string;

  @Column({ field: 'last_name', type: DataType.STRING })
  lastName: string;

  @Unique
  @Is('username', usernameValidator)
  @AllowNull(true)
  @Column({ field: 'username', type: DataType.STRING(32), validate: { len: [0, 32] } })
  username: string;

  @Unique
  @Column(DataType.STRING)
  token: string | null;

  @AllowNull(true)
  @Column({ field: 'token_exp', type: DataType.INTEGER })
  tokenExp: number | null;

  @Column(DataType.STRING)
  hashanswer: string;

  @Column({ field: 'security_question', type: DataType.STRING })
  securityQuestion: string;

  @Default(false)
  @Column({ field: 'opt_in_beta', type: DataType.BOOLEAN })
  optInBeta: boolean;

  @Column({ field: 'deleted_at', type: DataType.DATE })
  deletedAt: Date | null;

  @AllowNull(false)
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    // KLUDGE: Sequelize complains about setting enum arrays, so we're using a workaround!
    set (userRoles: string[] = []): void {
      this.setDataValue(
        // @ts-ignore
        'roles',
        literal(`ARRAY[${userRoles.map(role => `'${role}'`).join(',')}]::USER_ROLE[]`)
      );
    }
  })
  roles: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    // KLUDGE: Sequelize complains about setting enum arrays, so we're using a workaround!
    set (restrictions: string[] = []): void {
      this.setDataValue(
        // @ts-ignore
        'restrictions',
        literal(`ARRAY[${restrictions.map(restriction => `'${restriction}'`).join(',')}]::ACCOUNT_RESTRICTION[]`)
      );
    }
  })
  restrictions: string[] | null;

  @ForeignKey(() => UserModel)
  @Column({ field: 'referrer_user_id', type: DataType.UUID })
  referrerUserId: string;

  @BelongsTo(() => UserModel, 'referrer_user_id')
  referrer: UserModel;

  @Column({ field: 'refresh_tokens', type: DataType.ARRAY(DataType.STRING) })
  refreshTokens: string[] | null;

  @Default(fn('now'))
  @AllowNull(false)
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt: Date;

  @Column(new DataType.VIRTUAL(DataType.BOOLEAN, ['roles']))
  get isAdmin (): boolean {
    const roles = this.getDataValue('roles');
    return Array.isArray(roles)
      ? roles.some(role => role === USER_ROLE.ADMIN) || false
      : false;
  }

  @Column(new DataType.VIRTUAL(DataType.BOOLEAN, ['roles']))
  get isSuperAdmin (): boolean {
    const roles = this.getDataValue('roles');
    return Array.isArray(roles)
      ? roles.some(role => role === USER_ROLE.SUPER_ADMIN) || false
      : false;
  }

  @Column(new DataType.VIRTUAL(DataType.STRING, ['firstName', 'lastName']))
  get fullName (): string {
    const nameFirst = this.getDataValue('firstName');
    const nameLast = this.getDataValue('lastName');

    let fullName: string = nameFirst;
    if (nameLast && nameFirst) {
      fullName = `${nameFirst} ${nameLast}`;
    }
    if (nameLast && !nameFirst) {
      fullName = nameLast;
    }
    return fullName;
  }

  @Column(new DataType.VIRTUAL(DataType.BOOLEAN, ['restrictions']))
  get accountLocked (): boolean {
    const restrictions = this.getDataValue('restrictions');

    return restrictions
      ? Array.isArray(restrictions) && restrictions.length > 1
      : false;
  }

  async getEmails (): Promise<EmailModelType[]> {
    this.emails = null
      || this.emails
      || await EmailModel.findAllByUserId(this.id);
    return this.emails;
  }

  async getEmailData (): Promise<EmailType[]> {
    if (
      !Array.isArray(this.emails)
      || this.emails.length
    ) {
      await this.getEmails();
    }

    const emailData: EmailType[] = [];
    for (const email of this.emails) {
      emailData.push({
        id: email.id,
        email: email.email,
        label: email.label,
        default: email.default,
        isDeleted: email.isDeleted,
        isVerified: email.isVerified
      });
    }

    return emailData;
  }

  async getEmail (email: string): Promise<EmailModelType | null> {
    const emails = await this.getEmails();
    return emails.find(emailModel => email === emailModel.email) || null;
  }

  async getVerifiedEmail (): Promise<string | null> {
    const emails = await this.getEmails();

    const data: EmailModelType | undefined = maxBy(
      emails.filter(({ isVerified, isDeleted }) => isVerified && !isDeleted),
      ({ verifiedAt }) => verifiedAt
    );

    return data && data.email || null;
  }

  async getDefaultEmail (): Promise<string | null> {
    const email = await this.getDefaultEmailModel();
    return email && email.email || null;
  }

  async getDefaultEmailModel(): Promise<EmailModel> {
    const emails = await this.getEmails();

    const EmailModel: EmailModelType | undefined = emails.find((email) => {
      return email.default;
    });

    return EmailModel
  }

  async getPhones (): Promise<PhoneModelType[]> {
    this.phones = null
      || this.phones
      || await PhoneModel.findAllByUserId(this.id);
    return this.phones;
  }

  async getPhoneData (): Promise<PhoneType[]> {
    if (
      !Array.isArray(this.phones)
      || this.phones.length
    ) {
      await this.getPhones();
    }

    const phoneData: PhoneType[] = [];
    for (const phone of this.phones) {
      phoneData.push({
        id: phone.id,
        countryCode: phone.countryCode,
        regionCode: phone.regionCode,
        default: phone.default,
        isDeleted: phone.isDeleted,
        isSent: phone.isSent,
        isVerified: phone.isVerified,
        label: phone.label,
        phone: phone.phone,
        phoneFormatted: phone.phoneFormatted,
      });
    }

    return phoneData;
  }

  async getPhone (phone: string): Promise<PhoneModelType | null> {
    const phones = await this.getPhones();
    return phones.find(PhoneModel => phone === PhoneModel.phone) || null;
  }

  async getVerifiedPhone (): Promise<string | null> {
    const phones = await this.getPhones();

    const PhoneModel: PhoneModelType | undefined = maxBy(
      phones.filter(({ isVerified, isDeleted }) => isVerified && !isDeleted),
      ({ verifiedAt }) => verifiedAt
    );

    return PhoneModel && PhoneModel.phone || null;
  }

  async getDefaultPhone (): Promise<string | null> {
    const phone = await this.getDefaultPhoneModel();
    return phone && phone.phone || null;
  }

  async getDefaultPhoneModel (): Promise<PhoneModelType> {
    const phones = await this.getPhones();

    const result = phones.find((phone) => {
      return phone.default && phone.deletedAt === null;
    });

    return result || null;
  }

  async fetchConnectedDevice(): Promise<DeviceModel | null> {
    try {
      const device = await DeviceModel.findOne({
        where: {
          userId: this.id,
          deletedAt: {
            [Op.is]: null
          },
          // facialAuthState: {
          //   [Op.ne]: 'CHALLENGE'
          // }
        }
      });

      return device;
    } catch (e) { throw e; }
  }

    /**
   * Given a verification token, returns the prev verified device before a token.
   *
   */
  async fetchConnectedDeviceBeforeToken(token: string): Promise<DeviceModel | null> {
    try {
      const device = await DeviceModel.findOne({
        where: {
          userId: this.id,
          verificationToken: token
        }
      });


      if (device) {
        const prev = await DeviceModel.findOne({
          where: {
            createdAt: {
              [Op.lt]: device.createdAt
            },
            verifiedAt: {
              [Op.ne]: null
            },
            userId: this.id,
            // facialAuthState: {
            //   [Op.ne]: 'CHALLENGE'
            // }
          },
          order: [['created_at', 'DESC']]
        });

        return prev;
      }

      return null;
    } catch (e) { throw e; }
  }

  async getPrivilegSets (): Promise<UserPrivilegeSetModelType[]> {
    if (this.roles) {
      return await UserPrivilegeSetModel.findAll({
        where: {
          name: {
            [Op.in]: this.roles
          }
        }
      }) as UserPrivilegeSetModelType[];
    }

    return [];
  }

  hasRole (role: string): boolean {
    if (!(Array.isArray(this.roles))) {
      return false;
    }

    return this.roles.indexOf(role) > -1;
  }

  async hasSecuredAccount(): Promise<boolean> {
    const verifiedEmail = await this.getVerifiedEmail();
    const verifiedPhone = await this.getVerifiedPhone();
    if (this.isSuperAdmin) {
      return true;
    }

    return !!(
      verifiedEmail
      && this.hashword
    )
    || !!verifiedPhone;
  }

  static async registerAndCreateFromEmail (
    email: string,
    shouldValidate: boolean
  ): Promise<UserModelType> {
    const token = dxEncryptionGenerateRandomValue();
    const tokenExp = DxDateUtilClass.getTimestamp(2, 'days', 'ADD');

    const user = await UserModel.create({
      roles: [USER_ROLE.USER],
      token,
      tokenExp,
    });

    await EmailModel.createOrFindOneByUserId(user.id, email, token, shouldValidate);

    return user;
  }

  static async registerAndCreateFromPhone (
    phone: string,
    countryCode: string,
    regionCode: string
  ): Promise<UserModelType> {

    const user = await UserModel.create({
      roles: [USER_ROLE.USER]
    });

    await PhoneModel.createOrFindOneByUserId(user.id, phone, countryCode, regionCode, true);

    return user;
  }

  static async loginWithPassword (email: string, password: string): Promise<UserModelType | null> {
    const userEmail = await EmailModel.findOne({
      where: {
        email
      }
    });

    if (!userEmail) {
      throw new Error('EmailModel not found');
    }

    const user = await this.findOne({
      where: {
        id: userEmail.userId
      }
    });

    if (!user) {
      throw new Error('User not found!');
    }

    await user.getEmails();
    await user.getPhones();

    if (await dxEncryptionVerifyHash(user.hashword, password)) {
      return user;
    }

    return null;
  }

  static async loginWithUsernamePassword (username: string, password: string): Promise<UserModelType | null> {
    const user = await this.findOne({
      where: {
        username
      }
    });

    if (!user) {
      throw new Error('User not found!');
    }

    await user.getEmails();
    await user.getPhones();

    if (await dxEncryptionVerifyHash(user.hashword, password)) {
      return user;
    }

    return null;
  }

  static async userHasRole (id: string, role: string): Promise<boolean> {
    try {
      const user = await this.findByPk(id) as UserModelType;

      if (!user) {
        throw new Error('User not found tryna determine roles!');
      }

      return user.hasRole(role);
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  static async isUsernameAvailable (username: string): Promise<boolean> {
    const existing = await this.findOne({
      where: {
        username,
        deletedAt: null,
      }
    });

    if (existing === null) {
      return true;
    }

    return !existing;
  }

  static async createFromUsername (
    username: string,
    email: string,
    roles: string[],
    firstName?: string,
    lastName?: string,
    phone?: string,
    countryCode?: string,
    regionCode?: string,
    shouldValidate?: boolean
  ): Promise<UserModelType> {
    if (!await UserModel.isUsernameAvailable(username)) {
      throw new Error(`The username: ${username} is already in use.`);
    }

    if (!await EmailModel.isEmailAvailable(email)) {
      throw new Error(`The email: ${email} is already in use`);
    }

    if (phone && countryCode && !await PhoneModel.isPhoneAvailable(phone, countryCode)) {
      throw new Error(`The phone: ${phone} is already in use`);
    }

    try {
      const token = dxEncryptionGenerateRandomValue();
      const tokenExp = DxDateUtilClass.getTimestamp(2, 'days', 'ADD');
      const user = await UserModel.create({
        firstName,
        lastName,
        roles,
        token,
        tokenExp,
        username,
      });

      const [emailData, didCreateEmail] = await EmailModel.createOrFindOneByUserId(user.id, email, token, shouldValidate);
      if (didCreateEmail && emailData) {
        user.emails = [emailData];
      }

      if (phone && countryCode) {
        const [phoneData, didCreatePhone] = await PhoneModel.createOrFindOneByUserId(user.id, phone, countryCode, regionCode, shouldValidate);
        if (didCreatePhone && phoneData) {
          user.phones = [phoneData];
        }
      }

      return user;
    } catch (err) {
      throw err;
    }
  }

  static async getByRefreshToken (token: string): Promise<UserModelType> {
    const data = await this.findOne({
      where: {
        refreshTokens: { [Op.contains]: [token] },
        deletedAt: null
      }
    });

    if (!data) {
      throw new Error(`No user found with that token.`);
    }

    return data;
  }

  static async clearRefreshTokens (id: string): Promise<boolean> {
    if (
      !id
    ) {
      throw new Error(`No id provided.`);
    }

    const res = await UserModel.update(
      { refreshTokens: null },
      {
        where: {
          id,
          deletedAt: null
        }
      }
    );

    return res
     && Array.isArray(res)
      && res[0] === 0;
  }

  static async updateRefreshToken (
    id: string,
    token: string | string[],
    initialize?: boolean
  ): Promise<boolean> {
    if (
      !id
      || ! token
    ) {
      throw new Error(`No id or token provided.`);
    }

    let res: number[];

    if (Array.isArray(token)) {
      res = await UserModel.update(
        { refreshTokens: token },
        {
          where: {
            id,
            deletedAt: null
          }
        }
      );
    }

    if (typeof token === 'string') {
      if (initialize) {
        res = await UserModel.update(
          { refreshTokens: [token as string] },
          {
            where: {
              id,
              deletedAt: null
            }
          }
        );
      }

      if (!initialize) {
        res = await UserModel.update(
          { refreshTokens: fn('array_append', col('refresh_tokens'), token) },
          {
            where: {
              id,
              deletedAt: null
            }
          }
        );
      }
    }

    return res
      && Array.isArray(res)
      && res[0] !== 0;
  }

  static async getUserSessionData(id: string): Promise<UserSessionType> {
    const data = await this.findOne({
      where: {
        id,
        deletedAt: null,
      },
      include: [
        {
          model: DeviceModel
        },
        {
          model: EmailModel,
        },
        {
          model: PhoneModel,
        }
      ],
    });

    const sessionData: UserSessionType = {
      id: '',
      fullName: '',
      hasSecuredAccount: false,
      isAdmin: false,
      isSuperAdmin: false,
      optInBeta: false,
      roles: [],
      username: '',
      restrictions: []
    };

    if (data) {
      sessionData.fullName = data.fullName;
      sessionData.id = data.id;
      sessionData.hasSecuredAccount = await data.hasSecuredAccount();
      sessionData.isAdmin = data.isAdmin;
      sessionData.isSuperAdmin = data.isSuperAdmin;
      sessionData.optInBeta = data.optInBeta;
      sessionData.restrictions = data.restrictions;
      sessionData.roles = data.roles;
      sessionData.username = data.username;
    }

    return sessionData;
  }

  static async getBiomAuthKey(userId: string): Promise<string | null> {
    const user = await UserModel.findOne({
      where: { id: userId }
    });
    const device = user && await user.fetchConnectedDevice();
    return device && device.biomAuthPubKey;
  }

  static async setPasswordTest (
    id: string,
    password: string,
    securityAA: string,
    securityQQ: string
  ): Promise<[affectedCount: number]> {
    if (!password || !id) {
      throw new Error(`Bad data provided.`);
    }

    const user = await UserModel.findByPk(id);
    if (!user) {
      throw new Error('No user by that ID.');
    }

    if (user.accountLocked) {
      throw new Error('Cannot perform this operation. Account is locked.');
    }

    if (user.tokenExp < Math.round(new Date().getTime() / 1000)) {
      throw new Error('Token expired.');
    }

    const hashword = await dxEncryptionHashString(password);
    const hashanswer = await dxEncryptionHashString(securityAA);

    return await UserModel.update({
      hashword,
      hashanswer,
      securityQuestion: securityQQ,
      tokenExp: 0
    }, { where: { id, deletedAt: null } });
  }

  static async updatePassword (
    id: string,
    password: string
  ): Promise<boolean> {
    if (
      !password
      || !id
    ) {
      throw new Error(`Bad data provided.`);
    }

    // const user = await UserModel.findByPk(id);
    // const oldPasswordMatch = await dxEncryptionVerifyHash(user.hashword, oldPassword);

    // if (!oldPasswordMatch) {
    //   throw new Error(`Existing password does not match.`);
    // }

    const hashword = await dxEncryptionHashString(password);

    await UserModel.update({ hashword }, { where: { id, deletedAt: null } });

    return true;
  }

  static async removeUser (id: string): Promise<boolean> {
    try {
      const deviceDeleted = await DeviceModel.destroy({
        where: {
          userId: id
        },
        force: true
      });
      const emailDeleted = await EmailModel.destroy({
        where: {
          userId: id
        },
        force: true
      });
      const phoneDeleted = await PhoneModel.destroy({
        where: {
          userId: id
        },
        force: true
      });
      const userDeleted = await UserModel.destroy({
        where: {
          id
        },
        force: true
      });

      return !!userDeleted;
    } catch (err) {
      ApiLoggingClass.instance.logError(err);
    }

    return false;
  }

   // TODO: Remove
   static async getByToken (token: string): Promise<UserModelType> {
    const data = await this.findOne({
      where: {
        token,
        deletedAt: null,
      },
      include: [
        {
          model: EmailModel,
        },
        {
          model: PhoneModel,
        }
      ],
    });

    if (!data) {
      throw new Error(`No user found with that link.`);
    }

    const exp = DxDateUtilClass.getTimestamp();
    if (data.tokenExp < exp) {
      throw new Error(`Token has expired.`);
    }

    if (
      data.emails
      && Array.isArray(data.emails)
      && data.emails.length > 0
    ) {
      const emailToVerify = data.emails.find(email => email.token === token);
      await EmailModel.verifyEmail(emailToVerify.id);
    }

    return data;
  }

  // TODO: Remove
  static async updateToken (id: string): Promise<string> {
    if (!id) {
      throw new Error(`No user ID provided`);
    }

    const token = dxEncryptionGenerateRandomValue() as string;
    const tokenExp = DxDateUtilClass.getTimestamp(2, 'days', 'ADD');

    const res = await UserModel.update({
      token,
      tokenExp
    }, {
      where: {
        id,
        deletedAt: null,
        username: {
          [Op.ne]: 'admin'
        }
      }
    });

    if (res && Array.isArray(res) && res[0] === 0) {
      return '';
    }

    return token;
  }
}

export type UserModelType = typeof UserModel.prototype;
