import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import { FileJSON } from 'formidable';

export type AssetFileType = {
  bucket?: string;
  eTag?: string;
  format?: string;
  height?: number;
  key?: string;
  location?: string;
  size?: number;
  width?: number;
};

export type AssetDataType = {
  altText: string;
  assetSubType: string;
  assetType: string;
  files: AssetFileType[];
  hashedFilenameMimeType: string;
  id: string;
  originalFileName: string;
  ownerId: string;
  primary: boolean;
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
  altText: string;
  assetSubType: string;
  filePath: string;
  isPrimary?: boolean;
  ownerId: string;
};

export type UploadAssetHandlerParams = {
  fileSize: number;
  mimeType: string;
  newFilename: string;
  originalFilename: string;
  uploadId?: string;
} & UploadAssetParams;

export type UploadAssetFile = {
  format: string;
  key: string;
  width: number;
  fileName: FileJSON[];
};
