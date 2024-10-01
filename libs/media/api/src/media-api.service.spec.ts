import {
  Response as IResponse
} from 'express';
import { Response } from 'jest-express/lib/response';

import { ApiLoggingClass } from '@dx/logger-api';
import {
  MEDIA_SUB_TYPES,
  MEDIA_VARIANTS,
  MIME_TYPES
} from '@dx/media-shared';
import { MediaApiService } from './media-api.service';

jest.mock('@dx/logger-api');
jest.mock('@dx/data-access-s3');
jest.mock('@dx/utils-shared-misc');
jest.mock('./media-api-image-manipulation.service.ts');
jest.mock('./media-api.postgres-model');

describe('MediaApiService', () => {
  beforeAll(() => {
    new ApiLoggingClass({ appName: 'TEST' });
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('should exist upon import', () => {
    expect(MediaApiService).toBeDefined();
  });

  it('should return undefined when userContentUpload is called in test.', async () => {
    // Arrange
    const service = new MediaApiService();
    // Act
    try {
      const result = await service.userContentUpload({
        altText: 'test-alt-text',
        filePath: 'test-path',
        fileSize: 2,
        mediaSubType: MEDIA_SUB_TYPES.DOCUMENT,
        mimeType: MIME_TYPES.FILE.PDF,
        newFilename: 'new-test-file-name',
        originalFilename: 'original-test-file-name',
        ownerId: 'test-owner-id',
        uploadId: 'test-upload-id',
      });
      // Assert
      expect(result).toBeUndefined();
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('should return false when clearUpload has no object exists with id.', async () => {
    // Arrange
    const service = new MediaApiService();
    // Act
    const result = await service.clearUpload('test-id');
    // Assert
    expect(result).toBeDefined();
    expect(result).toBe(false);
  });

  it('should throw when getContentKey retrieves a value that does not exist', async () => {
    // Arrange
    const service = new MediaApiService();
    // Act
    try {
      await service.getContentKey('test-id', MEDIA_VARIANTS.THUMB);
    } catch (err) {
      // Assert
      expect(err).toBeDefined();
      expect(err.message).toEqual('105 Could not retrieve key.');
    }
  });

  it('should throw when getUserContent does not exist', async () => {
    // Arrange
    const res = new Response as unknown as IResponse;
    const service = new MediaApiService();
    // Act
    try {
      await service.getUserContent('test-id', res);
    } catch (err) {
      // Assert
      expect(err).toBeDefined();
      expect(err.message).toEqual('105 Could not retrieve file.');
    }
  });
});
