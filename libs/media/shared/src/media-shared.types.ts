import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import { FileJSON } from 'formidable';
// import FileJSON from 'formidable/PersistentFile';

export type AssetFileType = {
  size?: number;
  width?: number;
  height?: number;
  format?: string;
  bucket?: string;
  key?: string;
  location?: string;
  originalFileName?: string;
  eTag?: string;
};

export type AssetEsDataType = {
  id: string;
  ownerId: string;
  altText: string;
  originalFileName: string;
  campaignIds: string[];
  canopusId: string;
  builderUserId: string;
  md5FileHash: string;
  assetType: string;
  files: AssetFileType[];
  assetSubType: string;
};

export type AssetDataType = {
  id: string;
  ownerId: string;
  altText: string;
  originalFileName: string;
  campaignId: string;
  campaignIds: string[];
  canopusId: string;
  builderUserId: string;
  md5FileHash: string;
  assetType: string;
  files: AssetFileType[];
  assetSubType: string;
  mediaLibraries?: string[] | AssetDataType[];
};

export type ImageResizeAssetType = {
  asset: string | Buffer;
  id: string;
  size?: number;
  width?: number;
  height?: number;
  format?: string;
  metaData?: { [key: string]: string };
  s3UploadedFile?: CompleteMultipartUploadCommandOutput;
};

export type UploadAssetParams = {
  ownerId: string[];
  altText: string[];
  campaignId: string[];
  canopusId: string[];
  builderUserId: string[];
  assetSubType: string[];
  mediaLibraryId: string[];
};

export type UploadAssetFile = {
  format: string;
  key: string;
  width: number;
  fileName: FileJSON[];
};
