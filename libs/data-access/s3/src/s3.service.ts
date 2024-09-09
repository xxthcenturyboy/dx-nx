import {
  CopyObjectCommand,
  CopyObjectCommandInput,
  CreateBucketCommand,
  CreateBucketCommandInput,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListBucketsCommand,
  ListObjectsCommand,
  ListObjectsCommandOutput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { Response } from 'express';

import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger-api';
import {
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY
} from '@dx/config-api';


export class S3Service {
  private logger: ApiLoggingClassType;
  private s3: typeof S3.prototype;

  constructor() {
    this.logger = ApiLoggingClass.instance;
    this.s3 = S3Service.getS3Client();
  }

  public static getS3Client() {
    let s3Instance: typeof S3.prototype;
    try {
      if (
        S3_ACCESS_KEY_ID
        && S3_SECRET_ACCESS_KEY
      ) {
        s3Instance = new S3({
          credentials: {
            accessKeyId: S3_ACCESS_KEY_ID,
            secretAccessKey: S3_SECRET_ACCESS_KEY
          },
        });
      } else {
        s3Instance = new S3({
          endpoint: 'http://localstack:4566',
          forcePathStyle: true,
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test'
          }
        });
      }
    } catch (err) {
      ApiLoggingClass.instance.logError(err);
    }

    return s3Instance;
  }

  private async createBucket(bucketName: string) {
    const params: CreateBucketCommandInput = {
      Bucket: bucketName
    };
    const createBucketCmd = new CreateBucketCommand(params);
    try {
      const createResponse = await this.s3.send(createBucketCmd);
      if (createResponse.Location) {
        return true;
      }

      return false;
    } catch (err) {
      this.logger.logError(err);
      return false;
    }
  }

  private async createFolder(
    bucketName: string,
    folderName: string
  ) {
    try {
      const createObjectCmd = new PutObjectCommand({
        Bucket: bucketName,
        Key: folderName,
        Body: Buffer.from('') // supressing aws sdk error
      });
      await this.s3.send(createObjectCmd);
      return true;
    } catch (err) {
      this.logger.logError(err);
      return false;
    }
  }

  private async createFolderIfNotExists(
    bucketName: string,
    folderName: string
  ) {
    try {
      const headObjCmd = new HeadObjectCommand({
        Bucket: bucketName,
        Key: folderName
      });
      await this.s3.send(headObjCmd);
      return true;
    } catch (err) {
      this.logger.logError(err);
      if (err.name === 'NotFound') {
        console.log('folder not found');
        this.createFolder(bucketName, folderName);
      }
    }
  }

  private async doesBucketExist(bucketName: string) {
    try {
      const listCommand = new ListBucketsCommand();
      const listResponse = await this.s3.send(listCommand);
      let bucketExists = false;
      for (const bucket of listResponse.Buckets) {
        if (bucketName.startsWith(bucket.Name)) {
          bucketExists = true;
        }
      }

      return bucketExists;
    } catch (err) {
      this.logger.logError(err);
      return false;
    }
  }

  public async instantiate(
    appBucket: string,
    scopedBuckets: string[]
  ) {
    for (const scopedBucket of scopedBuckets) {
      const bucketName = `${appBucket}-${scopedBucket}`;
      if (!(await this.doesBucketExist(bucketName))) {
        await this.createBucket(bucketName);
      }
    }
  }

  public async uploadObject(
    bucket: string,
    key: string,
    file: Buffer,
    mimeType: string,
    metadata?: Record<string, string>
  ) {
    try {
      const params: PutObjectCommandInput = {
        Bucket: bucket,
        Key: key,
        Body: file,
        ContentType: mimeType,
        ACL: 'public-read',
        Metadata: metadata
      };
      return await new Upload({
        client: this.s3,
        params
      }).done();
    } catch (err) {
      this.logger.logError(err);
    }
  }

  async moveObject(
    sourcePath: string,
    destinationBucket: string,
    key: string,
    metaData?: Record<string, string>
  ) {
    const params: CopyObjectCommandInput = {
      Bucket: destinationBucket,
      CopySource: sourcePath,
      Key: key,
      Metadata: metaData
    };

    try {
      const command = new CopyObjectCommand(params);
      const moved = await this.s3.send(command);
      return moved.$metadata.httpStatusCode === 200;
    } catch (err) {
      this.logger.logError(err);
      throw new Error(err);
    }
  }

  async getObject(
    bucket: string,
    key: string,
    res?: Response
  ) {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
        ResponseCacheControl: 'max-age=31536000'
      });
      const file = await this.s3.send(command);

      if (
        file.Body instanceof Readable
      ) {
        if (res) {
          file.Body.once('error', (err) => {
            this.logger.logError('Error downloading S3 File', err);
          });

          res.set('etag', file.ETag);
          res.set('cache-control', file.CacheControl);

          file.Body.pipe(res);
        }

        return file.Body;
      }

      return null;
    } catch (ex) {
      this.logger.logError((ex as Error).message);
      throw new Error((ex as Error).message);
    }
  }

  async getSignedUrlPromise(
    bucketName: string,
    key: string,
    expiresInSeconds = 900
  ) {
    try {
      const params = {
        Bucket: bucketName,
        Key: key
      };

      const url = await getSignedUrl(this.s3, new GetObjectCommand(params), {
        expiresIn: expiresInSeconds,
      });

      return { url, expires: expiresInSeconds };

    } catch (ex) {
      const message = `Error Getting Signed Url. Message: ${(ex as Error).message}`;
      throw new Error(message);
    }
  }

  async emptyS3Directory(
    bucket: string,
    dir: string
  ) {
    if (!dir) {
      this.logger.logError('Directory name not provided.');
      return {
        removed: false,
        message: 'Director not provided.'
      };
    }

    const LIST_PARAMS = {
      Bucket: bucket,
      Prefix: `${dir}/`
    };

    const listCommand = new ListObjectsCommand(LIST_PARAMS);
    let listedObjects: ListObjectsCommandOutput;
    try {
      listedObjects = await this.s3.send(listCommand);
    } catch (err) {
      this.logger.logError(`Could not get list of object for: ${LIST_PARAMS.Prefix}`);
      this.logger.logError(err);
    }

    if (
      listedObjects &&
      listedObjects?.Contents
      && listedObjects.Contents.length === 0
    ) {
      this.logger.logInfo(`S3 directory was empty: slug: ${dir}, in bucket: ${bucket}`);
      return {
        removed: true,
        message: 'Directory is empty'
      };
    }

    const deleteParams = {
      Bucket: bucket,
      Delete: { Objects: [] }
    };

    listedObjects.Contents?.forEach(({ Key }) => {
      return !!Key && deleteParams.Delete.Objects.push({ Key });
    });

    const deleteCommand = new DeleteObjectsCommand(deleteParams);
    try {
      await this.s3.send(deleteCommand);
    } catch (err) {
      this.logger.logError(`Could not delete objects from: ${LIST_PARAMS.Prefix}`);
      this.logger.logError(err);
    }

    // there were sooo many items in the directory that the original list was truncated
    // run this function again.
    if (listedObjects.IsTruncated) {
      this.logger.logInfo(`directory: { bucket: ${LIST_PARAMS.Bucket}, prefix: ${LIST_PARAMS.Prefix} } is truncated, recursing`);
      await this.emptyS3Directory(bucket, dir);
    }

    return {
      removed: true,
      message: 'Success'
    };
  }
}

export type S3ServiceType = typeof S3Service.prototype;
