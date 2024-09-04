import { fn } from 'sequelize';
import {
  Index,
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  Default,
  PrimaryKey,
  AllowNull,
  Unique,
  UpdatedAt,
} from 'sequelize-typescript';

import { MEDIA_API_POSTGRES_DB_NAME } from './media-api.consts';
import {
  AssetFileType,
  ASSET_SUB_TYPES,
  AssetDataType
} from '@dx/media-shared';
import { parseJson } from '@dx/utils-shared-misc';

@Table({
  modelName: MEDIA_API_POSTGRES_DB_NAME,
  indexes: [
    {
      name: 'media_sub_type_index',
      fields: ['asset_sub_type']
    },
    {
      name: 'media_owner_id_index',
      fields: ['owner_id']
    },
    {
      name: 'media_sub_type_primary_index',
      fields: ['primary', { name: 'asset_sub_type' }]
    }
  ],
  underscored: true,
})
export class MediaModel extends Model<MediaModel> {
  @PrimaryKey
  @AllowNull(false)
  @Column(DataType.UUID)
  id: string;

  @Column({
    field: 'alt_text',
    type: DataType.STRING
  })
  altText: string;

  @Column({
    field: 'asset_sub_type',
    type: DataType.STRING
  })
  assetSubType: string;

  @Column({
    field: 'asset_type',
    type: DataType.STRING
  })
  assetType: string;

  @Column({
    field: 'files',
    type: DataType.ARRAY(DataType.JSONB)
  })
  files: any;

  @Column({
    field: 'hashed_filename_mimetype',
    type: DataType.STRING
  })
  hashedFilenameMimeType: string;

  @Column({
    field: 'original_file_name',
    type: DataType.STRING
  })
  originalFileName: string;

  @Column({
    field: 'owner_id',
    type: DataType.STRING
  })
  ownerId: string;

  @Column(DataType.BOOLEAN)
  primary: boolean;

  @CreatedAt
  @Default(fn('now'))
  @AllowNull(false)
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt: Date;

  @Column({ field: 'deleted_at', type: DataType.DATE })
  deletedAt: Date | null;

  @UpdatedAt
  @Default(fn('now'))
  @AllowNull(false)
  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt: Date;

  parseFiles(): void {
    if (this.files) {
      this.files = parseJson<AssetFileType[]>(this.files);
    }
  }

  static async findAllByOwnerId(ownerId: string): Promise<MediaModelType[]> {
    return await MediaModel.findAll({
      where: {
        ownerId,
        deletedAt: null,
      },
    });
  }

  static async findPrimaryProfile(ownerId: string): Promise<MediaModelType> {
    return await MediaModel.findOne({
      where: {
        ownerId,
        assetSubType: ASSET_SUB_TYPES.PROFILE_IMAGE,
        deletedAt: null,
        primary: true
      },
    });
  }

  static async findAllProfileByOwnerId(ownerId: string): Promise<MediaModelType[]> {
    return await MediaModel.findAll({
      where: {
        ownerId,
        assetSubType: ASSET_SUB_TYPES.PROFILE_IMAGE,
        deletedAt: null,
      },
    });
  }

  static async clearAllPrimaryProfileMedia(ownerId: string): Promise<void> {
    const medias = await MediaModel.findAllProfileByOwnerId(ownerId);
    for (const media of medias) {
      media.primary = false;
      await media.save();
    }
  }

  static async createNewProfileMedia(data: AssetDataType): Promise<MediaModel> {
    await MediaModel.clearAllPrimaryProfileMedia(data.ownerId);
    return await MediaModel.create(data);
  }
}

export type MediaModelType = typeof MediaModel.prototype;
