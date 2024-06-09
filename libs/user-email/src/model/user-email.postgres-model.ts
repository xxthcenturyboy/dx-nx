import {
  fn,
  Op
} from 'sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  Default,
  ForeignKey,
  PrimaryKey,
  AllowNull,
  Unique,
  BelongsTo,
  IsEmail,
  DeletedAt
} from 'sequelize-typescript';
import { DISPOSABLE_EMAIL_DOMAINS } from '@dx/utils';
import {
  USER_EMAIL_LABEL,
  USER_EMAIL_POSTGRES_DB_NAME
} from './user-email.consts';
import { UserModel } from '@dx/user';

@Table({
  modelName: USER_EMAIL_POSTGRES_DB_NAME,
  indexes: [],
  underscored: true,
  timestamps: true,
})
export class UserEmailModel extends Model<UserEmailModel> {
  @PrimaryKey
  @Default(fn('uuid_generate_v4'))
  @AllowNull(false)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column({ field: 'user_id', type: DataType.UUID })
  userId: string;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @IsEmail
  @AllowNull(false)
  @Column(DataType.STRING)
  email: string;

  @Unique
  @Column(DataType.STRING)
  token: string | null;

  @Column(DataType.STRING)
  label: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  default: boolean;

  @Column({ field: 'last_sg_message_id', type: DataType.STRING })
  lastSgMessageId: string;

  @Column({ field: 'last_verification_sent_at', type: DataType.DATE })
  lastVerificationSentAt: Date;

  @DeletedAt
  @Column({ field: 'deleted_at', type: DataType.DATE })
  deletedAt: Date | null;

  @Column({ field: 'verified_at', type: DataType.DATE })
  verifiedAt: Date | null;

  @CreatedAt
  @Default(fn('now'))
  @AllowNull(false)
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt: Date;

  @Default(fn('now'))
  @AllowNull(false)
  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt: Date;

  @Column(new DataType.VIRTUAL(DataType.BOOLEAN, ['verifiedAt', 'deletedAt']))
  get isVerified (): boolean {
    return !!this.getDataValue('verifiedAt') && !this.getDataValue('deletedAt');
  }

  @Column(new DataType.VIRTUAL(DataType.BOOLEAN, ['deletedAt']))
  get isDeleted (): boolean {
    return !!this.getDataValue('deletedAt');
  }

  static async createOrFindOneByUserId (userId: string, email: string, token: string | null): Promise<[UserEmailModelType, boolean]> {
    const UserEmail = await this.findOrCreate({
      where: {
        userId,
        email
      },
      defaults: {
        userId,
        email,
        token,
        default: true,
        label: USER_EMAIL_LABEL.MAIN,
      }
    });

    return UserEmail;
  }

  static async isEmailAvailable (email: string): Promise<boolean> {
    const existing = await this.findOne({
      where: {
        email,
        // @ts-ignore
        verifiedAt: {
          [Op.ne]: null,
        },
        deletedAt: null,
      },
    });

    if (existing === null) {
      return true;
    }

    return !existing;
  }

  static async findAllByUserId (userId): Promise<UserEmailModelType[]> {
    return await UserEmailModel.findAll({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }

  static async assertEmailIsValid (email: string): Promise<void> {
    const cleanedEmail = email.replace(/\s/g, '').toLowerCase();

    // Disallow dots and plus
    const emailParts = cleanedEmail.split('@');
    const [prefix, domain] = emailParts;

    const hasInvalidCharsInPrefix = /\+/.test(prefix);
    const badGmail = domain === 'gmail.com' && /[\+]/.test(prefix);
    if (hasInvalidCharsInPrefix || badGmail) {
      throw new Error(`
          The email you provided is not valid.
      `);
    }

    // disallow disposable domains
    if (DISPOSABLE_EMAIL_DOMAINS[domain]) {
      // tslint:disable-next-line:max-line-length
      throw new Error('The email you provided is not valid. Please note that we do not allow disposable emails or emails that do not exist, so make sure to use a real email address.');
    }
  }

  static async clearAllDefaultByUserId (userId: string): Promise<void> {
    const emails = await UserEmailModel.findAllByUserId(userId);
    for (const email of emails) {
      email.default = false;
      await email.save();
    }
  }

  static async validateEmail (email: string): Promise<void> {
    UserEmailModel.update({
      verifiedAt: new Date()
    }, {
      where: {
        email,
        deletedAt: null
      }
    });
  }

  static async updateMessageInfoValidate (email: string, messageId: string): Promise<void> {
    UserEmailModel.update({
      lastSgMessageId: messageId,
      lastVerificationSentAt: new Date(),
      verifiedAt: null
    }, {
      where: {
        email,
        deletedAt: null
      }
    });
  }

  static async updateMessageInfo (email: string, messageId: string): Promise<void> {
    UserEmailModel.update({
      lastSgMessageId: messageId
    }, {
      where: {
        email,
        deletedAt: null
      }
    });
  }

  static async validateEmailWithToken (token: string): Promise<UserEmailModelType> {
    const email = await UserEmailModel.findOne({
      where: {
        token,
        deletedAt: null
      }
    });

    if (!email) {
      throw new Error('Token is invalid');
    }

    email.verifiedAt = new Date();
    email.token = null;
    await email.save();

    return email;
  }

}

export type UserEmailModelType = typeof UserEmailModel.prototype;
