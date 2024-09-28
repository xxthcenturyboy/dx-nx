import {
  CopyObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3,
} from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { sdkStreamMixin } from '@smithy/util-stream';
import { Readable } from 'stream';
import {
  S3Service,
  S3ServiceType
} from './s3.service';

import { ApiLoggingClass } from '@dx/logger-api';
import { API_APP_NAME } from '@dx/config-api';

const s3Mock = mockClient(S3);
jest.mock('@dx/logger-api');
jest.mock('@aws-sdk/s3-request-presigner', () => {
  return {
    getSignedUrl: jest.fn(() => {
      return 'test-url';
    })
  };
});

describe('s3.service', () => {
  let service: S3ServiceType;
  const testBucketName = 'test-bucket';
  const testDir = 'test-dir'

  beforeAll(() => {
    new ApiLoggingClass({ appName: API_APP_NAME });
    service = new S3Service();
  });

  afterAll(async () => {
    jest.clearAllMocks();
    s3Mock.reset();
  });

  describe('S3Service', () => {
    it('should exist when imported', () => {
      // Arrange
      // Act
      // Assert
      expect(S3Service).toBeDefined();
      expect(service.emptyS3Directory).toBeDefined();
      expect(service.getObject).toBeDefined();
      expect(service.getSignedUrlPromise).toBeDefined();
      expect(service.instantiate).toBeDefined();
      expect(service.moveObject).toBeDefined();
      expect(service.uploadObject).toBeDefined();
    });
  });

  describe('emptyS3Directory', () => {
    afterEach(() => {
      s3Mock.reset();
    });

    it('should succeed with message \'Directory is empty\' when no data is present', async () => {
      // Arrange
      s3Mock.on(ListObjectsCommand).resolves({
        Contents: []
      });
      // Act
      const removed = await service.emptyS3Directory(testBucketName, testDir);
      // Assert
      expect(removed).toBeDefined();
      expect(removed.removed).toBe(true);
      expect(removed.message).toEqual('Directory is empty');
    });

    it('should succeed with message \'Success\' when data is present', async () => {
      // Arrange
      const contents = [
        { Key: 'object-1' },
        { Key: 'object-2' }
      ];
      s3Mock.on(ListObjectsCommand).resolves({
        Contents: contents
      });
      s3Mock.on(DeleteObjectsCommand).resolves({
        Deleted: contents
      });
      // Act
      const removed = await service.emptyS3Directory(testBucketName, testDir);
      // Assert
      expect(removed).toBeDefined();
      expect(removed.removed).toBe(true);
      expect(removed.message).toEqual('Success');
    });
  });

  describe('getObject', () => {
    afterEach(() => {
      s3Mock.reset();
    });

    it('should succeed when invoked.', async () => {
      // Arrange
      // create Stream from string
      const stream = new Readable();
      stream.push('hello world');
      stream.push(null); // end of stream
      // wrap the Stream with SDK mixin
      const sdkStream = sdkStreamMixin(stream);
      s3Mock.on(GetObjectCommand).resolves({ Body: sdkStream });
      // Act
      const getObjectResult = await service.getObject(testBucketName, testDir);
      const result = await getObjectResult.transformToString();
      // Assert
      expect(result).toBeDefined();
      expect(result).toEqual('hello world');
    });
  });

  describe('getSignedUrlPromise', () => {
    afterEach(() => {
      s3Mock.reset();
    });

    it('should succeed when invoked.', async () => {
      // Arrange
      // Act
      const result = await service.getSignedUrlPromise(testBucketName, testDir);
      // Assert
      expect(result).toBeDefined();
      expect(result.url).toEqual('test-url');
      expect(result.expires).toEqual(900);
    });
  });

  describe('instantiate', () => {
    afterEach(() => {
      s3Mock.reset();
    });

    it('should succeed without error when invoked.', async () => {
      // Arrange
      s3Mock.on(ListBucketsCommand).resolves({ Buckets: [] });
      // Act
      await service.instantiate(testBucketName, [testDir]);
      // Assert
      expect(true).toBeTruthy();
    });
  });

  describe('moveObject', () => {
    afterEach(() => {
      s3Mock.reset();
    });

    it('should succeed without error when invoked.', async () => {
      // Arrange
      s3Mock.on(CopyObjectCommand).resolves({ $metadata: { httpStatusCode: 200 } });
      // Act
      const result = await service.moveObject('test-path', testBucketName, testDir);
      // Assert
      expect(result).toBe(true);
    });
  });

  describe('uploadObject', () => {
    afterEach(() => {
      s3Mock.reset();
    });

    it('should succeed without error when invoked.', async () => {
      // Arrange
      s3Mock.on(PutObjectCommand).resolves({ ETag: '1' });
      // Act
      const result = await service.uploadObject(
        testBucketName,
        testDir,
        Buffer.from('test-upload-data'),
        'string'
      );
      // Assert
      expect(result).toBeDefined();
    });
  });
});
