import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3';
import { FileJSON } from 'formidable';

export type MediaFileType = {
  bucket?: string;
  eTag?: string;
  format?: string;
  height?: number;
  key?: string;
  location?: string;
  size?: number;
  width?: number;
};

export type MediaDataType = {
  altText: string;
  mediaSubType: string;
  mediaType: string;
  files: {
    [variant: string]: MediaFileType
  };
  hashedFilenameMimeType: string;
  id: string;
  originalFileName: string;
  ownerId: string;
  primary: boolean;
};

export type ImageResizeMediaType = {
  asset: string | Buffer;
  id: string;
  size?: number;
  width?: number;
  height?: number;
  format?: string;
  metaData?: { [key: string]: string };
  s3UploadedFile?: CompleteMultipartUploadCommandOutput;
  variant?: string;
};

export type UploadMediaParams = {
  altText: string;
  mediaSubType: string;
  filePath: string;
  isPrimary?: boolean;
  ownerId: string;
};

export type UploadMediaHandlerParams = {
  fileSize: number;
  mimeType: string;
  newFilename: string;
  originalFilename: string;
  uploadId?: string;
} & UploadMediaParams;

export type UploadMediaFile = {
  format: string;
  key: string;
  width: number;
  fileName: FileJSON[];
};
