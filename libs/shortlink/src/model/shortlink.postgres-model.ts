import sequelize from 'sequelize';
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
  Unique
} from 'sequelize-typescript';
import { CLIENT_APP_URL } from '@dx/config';
import { ApiLoggingClass } from '@dx/logger';
import {
  randomId,
  malicousUrlCheck
} from '@dx/utils';
import { SHORTLINK_POSTGRES_DB_NAME } from '../model/shortlink.consts';

@Table({
  modelName: SHORTLINK_POSTGRES_DB_NAME,
  underscored: true,
  timestamps: true,
})
export class ShortLinkModel extends Model<ShortLinkModel> {
  @PrimaryKey
  @Default(() => randomId())
  @Column(DataType.STRING)
  id: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  target: string;

  @Default(sequelize.fn('now'))
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt: Date;

  public static async generateShortlink(url: string): Promise<string> {
    try {
      malicousUrlCheck(url);

      // Check if we have this already
      const existing = await ShortLinkModel.findOne({
        where: {
          target: url
        }
      });

      if (existing) {
        return `${CLIENT_APP_URL}/l/${existing.id}`;
      }

      // Create a new short link
      const shortlink = await ShortLinkModel.create({
        target: url
      });

      return `${CLIENT_APP_URL}/l/${shortlink.id}`;
    } catch (err) {
      ApiLoggingClass.instance.logError(err);
      throw err;
    }
  }

  public static async getShortLinkTarget(id: string): Promise<string> {
    try {
      const link = await ShortLinkModel.findOne({
        where: {
          id
        }
      });

      if (link) {
        malicousUrlCheck(link.target);
        return link.target;
      }

      return '';
    } catch (err) {
      ApiLoggingClass.instance.logError(err);
      throw err;
    }
  }
}

export type ShortLinkModelType = typeof ShortLinkModel.prototype;
