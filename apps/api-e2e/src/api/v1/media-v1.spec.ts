import axios,
{
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';

import {
  TEST_EXISTING_USER_ID,
} from '@dx/config-shared';
import {
  AuthSuccessResponseType
} from '@dx/auth-shared';
import {
  MEDIA_SUB_TYPES,
  MEDIA_VARIANTS,
  MediaDataType
} from '@dx/media-shared';
import {
  AuthUtil,
  AuthUtilType
} from './util-v1';

describe('v1 Media Routes', () => {
  let authRes: AuthSuccessResponseType;
  let authUtil: AuthUtilType;
  let mediaId = '';

  beforeAll(async () => {
    authUtil = new AuthUtil();
    const login = await authUtil.login();
    if (login) {
      authRes = login;
    }
  });

  describe('POST /api/v1/media/upload-user-content', () => {
    test('should return an error when no file is sent', async () => {
      //arrange
      const bodyFormData = new FormData();
      bodyFormData.append('file', '', 'test-media.png');
      const request: AxiosRequestConfig = {
        url: '/api/v1/media/upload-user-content',
        method: 'POST',
        headers: {
          ...authUtil.getHeaders(),
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
        data: bodyFormData
      };
      // act
      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual(
          'options.allowEmptyFiles is false, file size should be greater than 0'
        );
      }
    });

    test('should return a media record when successful', async () => {
       //arrange
       const filePath = path.join(__dirname, '../..', 'support', 'test-media.png');
       const file = fs.createReadStream(filePath);
       const bodyFormData = new FormData();
       bodyFormData.append('file', file, 'test-media.png');
       bodyFormData.append('mediaSubType', MEDIA_SUB_TYPES.IMAGE);
       const request: AxiosRequestConfig = {
         url: '/api/v1/media/upload-user-content',
         method: 'POST',
         headers: {
           ...authUtil.getHeaders(),
           'Content-Type': 'multipart/form-data'
         },
         withCredentials: true,
         data: bodyFormData
       };

      // act
      const result = await axios.request(request);
      // console.log(result.data);
      mediaId =result.data.id;
      // assert
      expect(result).toBeDefined();
      expect(result.status).toEqual(200);
      expect(result.data.id).toBeDefined();
      expect(result.data.mediaSubType).toEqual(MEDIA_SUB_TYPES.IMAGE);
      expect(result.data.files).toBeDefined();
      expect(result.data.files[MEDIA_VARIANTS.SMALL]).toBeDefined();
      expect(result.data.files[MEDIA_VARIANTS.MEDIUM]).toBeDefined();
      expect(result.data.files[MEDIA_VARIANTS.ORIGINAL]).toBeDefined();
      expect(result.data.files[MEDIA_VARIANTS.THUMB]).toBeDefined();
    });
  });

  describe('GET /api/v1/media/:id/:size', () => {
    test('should return status 200 and file when successful', async () => {
      //arrange
      const request: AxiosRequestConfig = {
        url: `/api/v1/media/${mediaId}/${MEDIA_VARIANTS.THUMB}`,
        method: 'GET',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true
      };

      // act
      const result = await axios.request(request);
      // assert
      expect(result).toBeDefined();
      expect(result.status).toEqual(200);
      expect(result.data).toBeDefined();
    });
  });
});
