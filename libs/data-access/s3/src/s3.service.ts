import {
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
  S3
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import moment from 'moment';

import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger-api';
import { S3_BUCKETS } from '@dx/media-shared';
import {
  S3_ACCESS_KEY_ID,
  S3_APP_BUCKET_NAME,
  S3_SECRET_ACCESS_KEY
} from '@dx/config-api';

export class S3Service {
  private bucketName = S3_APP_BUCKET_NAME;
  private logger: ApiLoggingClassType;
  private s3: typeof S3.prototype;

  constructor() {
    this.logger = ApiLoggingClass.instance;

    try {
      if (
        S3_ACCESS_KEY_ID
        && S3_SECRET_ACCESS_KEY
      ) {
        this.s3 = new S3({
          credentials: {
            accessKeyId: S3_ACCESS_KEY_ID,
            secretAccessKey: S3_SECRET_ACCESS_KEY
          },
        });
      } else {
        this.s3 = new S3({
          endpoint: 'http://localstack:4566',
          forcePathStyle: true,
          credentials: {
            accessKeyId: 'test',
            secretAccessKey: 'test'
          },
        });
      }
    } catch (err) {
      this.logger.logError(err);
    }
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

  public async instantiate() {
    for (const bucket of Object.keys(S3_BUCKETS)) {
      const bucketName = `${this.bucketName}-${S3_BUCKETS[bucket]}`;
      if (!(await this.doesBucketExist(bucketName))) {
        await this.createBucket(bucketName);
      }
    }
  }

  async upload(
    fileName: string,
    filePath: string,
    asset: Buffer,
    metadata: Record<string, string>
  ) {
    const key = filePath
      ? `${filePath}/${fileName}`
      : `${fileName}`;

    const params: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: key,
      Body: asset,
      Metadata: metadata
    };
    const started = moment();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    try {
      const data = await  new Upload({
        client: this.s3,
        params,
      }).done();
      const elapsedMs = +moment() - +started;
      this.logger.logInfo(`api:S3 upload took ${elapsedMs} ms`);
      return data;
    } catch (err) {
      const elapsedMs = +moment() - +started;
      _this.logger.logInfo(`api:S3 upload failed at ${elapsedMs} ms`);
      _this.logger.logError(err);
      return;
    }
  }

  async getObject(
    bucket: string,
    key: string,
    transformTostring?: boolean
  ) {
    const started = moment();
    try {
      const command = new GetObjectCommand({ Bucket: bucket, Key: key });
      const file = await this.s3.send(command);
      const elapsedMs = +moment() - +started;
      this.logger.logInfo(`api:S3 getObject took ${elapsedMs} ms`);

      if (file.Body) {
        if (transformTostring) {
          return file.Body.transformToString();
        }
        return file.Body;
      }

      return null;
    } catch (ex) {
      const elapsedMs = +moment() - +started;
      this.logger.logInfo(`api:S3 get Object took ${elapsedMs} ms`);
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
