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
  DeletedAt,
  Index
} from 'sequelize-typescript';
import {
  DEVICES_POSTGRES_DB_NAME,
  FACIAL_AUTH_STATE
} from './devices.consts';
import { UserModel } from '@dx/user';

@Table({
  modelName: DEVICES_POSTGRES_DB_NAME,
  underscored: true,
  timestamps: true,
})
export class DeviceModel extends Model<DeviceModel> {

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

  @CreatedAt
  @Default(fn('now'))
  @AllowNull(false)
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt: Date;

  @DeletedAt
  @Column({ field: 'deleted_at', type: DataType.DATE })
  deletedAt: Date | null;

  // @Unique
  @AllowNull(false)
  @Column({ field: 'unique_device_id', type: DataType.TEXT })
  /**
   * Unique ID per device
   */
  uniqueDeviceId: string;

  @Column({ field: 'device_id', type: DataType.TEXT })
  /**
   * e.g. iPhone,7 for an iphone 7
   */
  deviceId: string;

  @Column({ field: 'carrier', type: DataType.TEXT })
  carrier: string;

  @Column({ field: 'device_country', type: DataType.TEXT })
  deviceCountry: string;

  @Column({ field: 'name', type: DataType.TEXT })
  name: string;

  @Column({ field: 'biom_auth_pub_key', type: DataType.TEXT })
  biomAuthPubKey: string;

  @Column({ field: 'fcm_token', type: DataType.TEXT })
  fcmToken: string;

  @Column({ field: 'verification_token', type: DataType.TEXT })
  verificationToken: string;

  @Column({ field: 'verified_at', type: DataType.DATE })
  verifiedAt: Date | null;

  @Column({
    field: 'facial_auth_state',
    type: DataType.ENUM(FACIAL_AUTH_STATE.CHALLENGE, FACIAL_AUTH_STATE.NOT_APPLICABLE, FACIAL_AUTH_STATE.SUCCESS)
  })
  facialAuthState: string;

  //////////////// Methods //////////////////

  static async findByFcmToken(
    fcmToken: string,
    userId: string
  ) {
    const device = await DeviceModel.findOne({
      where: {
        fcmToken: fcmToken,
        deletedAt: {
          [Op.is]: null
        },
        userId: {
          [Op.ne]: userId
        }
      }
    });

    return device;
  }

  static async findByFcmTokenNotCurrentUser(
    fcmToken: string,
    userId: string
  ) {
    const device = await DeviceModel.findOne({
      where: {
        fcmToken,
        deletedAt: {
          [Op.is]: null
        },
        userId: {
          [Op.ne]: userId
        }
      }
    });

    return device;
  }

  static async findByVerificationToken(
    token: string
  ) {
    const device = await DeviceModel.findOne({
      where: {
        verificationToken: token
      },
      include: [UserModel]
    });

    return device;
  }

  static async markDeleted(deviceId: string): Promise<boolean> {
    const updated = await DeviceModel.update({
      deletedAt: new Date()
    }, {
      where: {
        id: deviceId
      }
    });

    return Array.isArray(updated) &&  updated[0] > 0;
  }
}

export type DeviceModelType = typeof DeviceModel.prototype;
