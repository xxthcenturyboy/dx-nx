import axios,
{
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';

import {
  NotificationCreationParamTypes,
  NOTIFICATION_ERRORS,
  NOTIFICATION_LEVELS
} from '@dx/notifications-shared';
import {
  TEST_EXISTING_USER_ID,
} from '@dx/config-shared';
import {
  AuthSuccessResponseType
} from '@dx/auth-shared';
import {
  AuthUtil,
  AuthUtilType
} from './util-v1';

describe('v1 Notification Routes', () => {
  let authRes: AuthSuccessResponseType;
  let authUtil: AuthUtilType;
  let idsToUpdate: string[] = [];

  beforeAll(async () => {
    authUtil = new AuthUtil();
    const login = await authUtil.login();
    if (login) {
      authRes = login;
    }
  });

  describe('POST /api/v1/notification/user', () => {
    test('should return an error when no userId and message is sent', async () => {
      //arrange
      const payload: NotificationCreationParamTypes = {
        userId: '',
        message: '',
        level: NOTIFICATION_LEVELS.INFO,
        title: 'TEST',
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/notification/user',
        method: 'POST',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
        data: payload
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
          NOTIFICATION_ERRORS.SERVER_ERROR
        );
      }
    });

    test('should return a notificaiton when successful', async () => {
      //arrange
      const payload: NotificationCreationParamTypes = {
        userId: TEST_EXISTING_USER_ID,
        message: 'Test Message',
        level: NOTIFICATION_LEVELS.INFO,
        title: 'TEST',
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/notification/user',
        method: 'POST',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
        data: payload
      };

      // act
      const result = await axios.request(request);
      idsToUpdate.push(result.data.id);
      // assert
      expect(result).toBeDefined();
      expect(result.status).toEqual(200);
      expect(result.data.title).toEqual('TEST');
    });
  });

  describe('POST /api/v1/notification/all-users', () => {
    test('should return an error when no userId and message is sent', async () => {
      //arrange
      const payload: Partial<NotificationCreationParamTypes> = {
        message: '',
        level: NOTIFICATION_LEVELS.INFO,
        title: 'TEST',
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/notification/all-users',
        method: 'POST',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
        data: payload
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
          NOTIFICATION_ERRORS.SERVER_ERROR
        );
      }
    });

    test('should return a notificaiton when successful', async () => {
      //arrange
      const payload: Partial<NotificationCreationParamTypes> = {
        message: 'Test Message',
        level: NOTIFICATION_LEVELS.INFO,
        title: 'TEST',
        suppressPush: true
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/notification/all-users',
        method: 'POST',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
        data: payload
      };

      // act
      const result = await axios.request(request);
      idsToUpdate.push(result.data.id);
      // assert
      expect(result).toBeDefined();
      expect(result.status).toEqual(200);
      expect(result.data.title).toEqual('TEST');
    });
  });

  describe('POST /api/v1/notification/app-update', () => {
    test('should return status 200 when successful', async () => {
      //arrange
      const request: AxiosRequestConfig = {
        url: '/api/v1/notification/app-update',
        method: 'POST',
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
    });
  });

  describe('GET /api/v1/notification/badge-count/:userId', () => {
    test('should return status 200 when successful', async () => {
      //arrange
      const request: AxiosRequestConfig = {
        url: `/api/v1/notification/badge-count/${TEST_EXISTING_USER_ID}`,
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
    });
  });

  describe('GET /api/v1/notification/user/:userId', () => {
    test('should return status 200 when successful', async () => {
      //arrange
      const request: AxiosRequestConfig = {
        url: `/api/v1/notification/user/${TEST_EXISTING_USER_ID}`,
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
      expect(result.data.user.length).toEqual(1);
    });
  });

  describe('PUT /api/v1/notification/read-all/:userId', () => {
    test('should return status 200 when successful', async () => {
      //arrange
      const request: AxiosRequestConfig = {
        url: `/api/v1/notification/read-all/${TEST_EXISTING_USER_ID}`,
        method: 'PUT',
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
    });
  });

  describe('PUT /api/v1/notification/viewed-all/:userId', () => {
    test('should return status 200 when successful', async () => {
      //arrange
      const request: AxiosRequestConfig = {
        url: `/api/v1/notification/viewed-all/${TEST_EXISTING_USER_ID}`,
        method: 'PUT',
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
    });
  });

  describe('PUT /api/v1/notification/dismiss-all/:userId', () => {
    test('should return status 200 when successful', async () => {
      //arrange
      const request: AxiosRequestConfig = {
        url: `/api/v1/notification/dismiss-all/${TEST_EXISTING_USER_ID}`,
        method: 'PUT',
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
    });
  });

  describe('PUT /api/v1/notification/dismiss/:id/:userId', () => {
    test('should return status 200 when successful', async () => {
      //arrange
      const request: AxiosRequestConfig = {
        url: `/api/v1/notification/dismiss/${idsToUpdate[0]}/${TEST_EXISTING_USER_ID}`,
        method: 'PUT',
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
    });
  });

  describe('PUT /api/v1/notification/read/:id', () => {
    test('should return status 200 when successful', async () => {
      //arrange
      const request: AxiosRequestConfig = {
        url: `/api/v1/notification/read/${idsToUpdate[1]}`,
        method: 'PUT',
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
    });
  });
});
