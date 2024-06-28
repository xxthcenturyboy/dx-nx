import { fn } from 'sequelize';
import {
  Table,
  Column,
  Model,
  DataType,
  Default,
  ForeignKey,
  PrimaryKey,
  AllowNull,
  BelongsTo,
  Index,
} from 'sequelize-typescript';

import {
  getTimeFromUuid,
  PhoneUtil
} from '@dx/utils';
import {
  PHONE_DEFAULT_REGION_CODE,
  PHONE_POSTGRES_DB_NAME
} from './phone.consts';
import { UserModel } from '@dx/user';

@Table({
  modelName: PHONE_POSTGRES_DB_NAME,
  indexes: [
    {
      unique: false,
      name: 'phone_user_id_index',
      fields: ['user_id']
    },
    {
      unique: false,
      name: 'country_code_phone_index',
      fields: ['country_code', 'phone']
    }
  ],
  underscored: true,
  timestamps: true,
})
export class PhoneModel extends Model<PhoneModel> {
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

  @AllowNull(false)
  @Column({ field: 'country_code', type: DataType.STRING(5) })
  countryCode: string;

  @AllowNull(false)
  @Column({ field: 'region_code', type: DataType.STRING(2), defaultValue: PHONE_DEFAULT_REGION_CODE })
  regionCode: string;

  // @Is(/^\+?[0-9]{7,15}$/)
  @AllowNull(false)
  @Column(DataType.STRING(20))
  phone: string;

  @Column(DataType.STRING)
  label: string;

  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  default: boolean;

  @Column({ field: 'twilio_message_id', type: DataType.STRING })
  twilioMessageId: string;

  @Column({ field: 'deleted_at', type: DataType.DATE })
  deletedAt: Date | null;

  @Column({ field: 'verified_at', type: DataType.DATE })
  verifiedAt: Date;

  @Default(fn('now'))
  @AllowNull(false)
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt: Date;

  @Default(fn('now'))
  @AllowNull(false)
  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt: Date;

  @Column(new DataType.VIRTUAL(DataType.STRING, ['countryCode', 'phone', 'regionCode']))
  get phoneFormatted(): string {
    const phoneUtil = new PhoneUtil(this.getDataValue('phone'), this.getDataValue('regionCode'));
    return phoneUtil.normalizedPhone;
  }

  @Column(new DataType.VIRTUAL(DataType.BOOLEAN, ['verifiedAt', 'deletedAt']))
  get isVerified(): boolean {
    return !!this.getDataValue('verifiedAt') && !this.getDataValue('deletedAt');
  }

  @Column(new DataType.VIRTUAL(DataType.BOOLEAN, ['deletedAt']))
  get isDeleted (): boolean {
    return !!this.getDataValue('deletedAt');
  }

  @Column(new DataType.VIRTUAL(DataType.DATE, ['twilioMessageId']))
  get twilioCodeSentAt(): Date {
    const twilioMessageId = this.getDataValue('twilioMessageId');
    return twilioMessageId && getTimeFromUuid(twilioMessageId);
  }

  @Column(new DataType.VIRTUAL(DataType.BOOLEAN, ['verifiedAt', 'twilioCodeSentAt']))
  get isSent(): boolean {
    return false
      || !!this.getDataValue('verifiedAt')
      || this.getDataValue('twilioCodeSentAt') > new Date(new Date().getTime() - 30000);
  }

  static async createOrFindOneByUserId (
    userId: string,
    phone: string,
    countryCode: string,
    regionCode?: string
  ): Promise<[PhoneModelType, boolean]> {
    const UserPhone = await this.findOrCreate({
      where: {
        userId,
        countryCode,
        phone,
        regionCode: regionCode || PHONE_DEFAULT_REGION_CODE
      },
      defaults: {
        userId,
        countryCode,
        phone,
        default: true,
        label: 'Default'
      }
    });

    return UserPhone;
  }

  static async isPhoneAvailable (phone: string, countryCode: string): Promise<boolean> {
    const existing = await this.findOne({
      where: {
        countryCode,
        phone,
        // @ts-ignore
        // verifiedAt: {
        //   [Op.ne]: null,
        // },
        deletedAt: null,
      },
    });

    if (existing === null) {
      return true;
    }

    return !existing;
  }

  static async findAllByUserId(userId): Promise<PhoneModelType[]> {
    return await PhoneModel.findAll({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }

  static async clearAllDefaultByUserId (userId: string): Promise<void> {
    const phones = await PhoneModel.findAllByUserId(userId);
    for (const phone of phones) {
      phone.default = false;
      await phone.save();
    }
  }

}

export type PhoneModelType = typeof PhoneModel.prototype;
