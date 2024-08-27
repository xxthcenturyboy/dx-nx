import {
  fn,
  NonAttribute
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
  Index,
} from 'sequelize-typescript';
import {
  UserModel,
  UserModelType
} from '@dx/user-api';
import {
  NotificationCreationParamTypes,
  NOTIFICATION_LEVELS
} from '@dx/notifications-shared';
import { NOTIFICATION_POSTGRES_DB_NAME } from './notification.consts';

@Table({
  modelName: NOTIFICATION_POSTGRES_DB_NAME,
  underscored: true,
  timestamps: true,
})
export class NotificationModel extends Model<NotificationModel> {
  @PrimaryKey
  @Default(fn('uuid_generate_v4'))
  @AllowNull(false)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column({ field: 'user_id', type: DataType.UUID })
  userId: string;

  @BelongsTo(() => UserModel, 'userId')
  declare user?: NonAttribute<UserModelType>;

  @CreatedAt
  @Default(fn('now'))
  @AllowNull(false)
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt: Date;

  @DeletedAt
  @Column({ field: 'deleted_at', type: DataType.DATE })
  deletedAt: Date | null;

  @Column(DataType.STRING)
  route: string;

  @Column(DataType.STRING)
  title: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  message: string;

  @Default(NOTIFICATION_LEVELS.INFO)
  @AllowNull(false)
  @Column({
    field: 'level',
    type: DataType.ENUM(
      NOTIFICATION_LEVELS.DANGER,
      NOTIFICATION_LEVELS.INFO,
      NOTIFICATION_LEVELS.PRIMARY,
      NOTIFICATION_LEVELS.SUCCESS,
      NOTIFICATION_LEVELS.WARNING
    )
  })
  level: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  viewed: boolean;

  @Column({ field: 'viewed_date', type: DataType.DATE })
  viewedDate: Date;

  @Default(false)
  @Column(DataType.BOOLEAN)
  read: boolean;

  @Column({ field: 'last_read_date', type: DataType.DATE })
  lastReadDate: Date;

  @Column({ field: 'dismissed_at', type: DataType.DATE })
  dismissedAt: Date;

  //////////////// Methods //////////////////

  static async createNew(params: NotificationCreationParamTypes): Promise<NotificationModel> {
    return NotificationModel.create({
      userId: params.userId,
      message: params.message,
      title: params.title,
      route: params.route,
      level: params.level
    });
  }

  static async getByUserId(userId: string): Promise<NotificationModel[]> {
    return NotificationModel.findAll({
      where: {
        userId,
        dismissedAt: null
      },
      limit: 1000,
      order: [
        ['createdAt', 'DESC']
      ]
    });
  }

  static async markAllAsRead(userId: string): Promise<[number]> {
    return NotificationModel.update({
      read: true,
      lastReadDate: new Date()
    }, {
      where: {
        userId,
        read: false
      }
    });
  }

  static async markAllDismissed(userId: string): Promise<[number]> {
    return NotificationModel.update({
      dismissedAt: new Date(),
      lastReadDate: new Date(),
      read: true,
      viewed: true,
      viewedDate: new Date()
    }, {
      where: {
        userId,
        dismissedAt: null
      }
    });
  }

  static async markAsRead(id: string): Promise<[number]> {
    return NotificationModel.update({
      read: true,
      lastReadDate: new Date()
    }, {
      where: {
        id
      }
    });
  }

  static async markAsViewed(userId: string): Promise<[number]> {
    return NotificationModel.update({
      viewed: true,
      viewedDate: new Date()
    }, {
      where: {
        userId,
        viewed: false
      }
    });
  }

  static async markAsDismissed(id: string): Promise<[number]> {
    return NotificationModel.update({
      dismissedAt: new Date(),
      lastReadDate: new Date(),
      read: true,
      viewed: true,
      viewedDate: new Date()
    }, {
      where: {
        id
      }
    });
  }
}

export type NotificationModelType = typeof NotificationModel.prototype;
