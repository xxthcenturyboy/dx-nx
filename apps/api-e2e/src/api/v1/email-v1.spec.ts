import { UserProfileStateType } from '@dx/user';
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';
import {
  AuthUtil,
  AuthUtilType
} from './util-v1';
import {
  CreateEmailPayloadType,
  UpdateEmailPayloadType
} from '@dx/email';
import {
  TEST_EMAIL,
  TEST_EXISTING_EMAIL,
  TEST_EXISTING_USER_ID,
  TEST_UUID
} from '@dx/config';
import { OtpResponseType } from '@dx/auth';

describe('v1 Email Routes', () => {
  let authRes: UserProfileStateType;
  let authUtil: AuthUtilType;
  let idToUpdate: string;

  beforeAll(async () => {
    authUtil = new AuthUtil();
    const login = await authUtil.login();
    if (login) {
      authRes = login;
    }
  });

  describe('POST /api/v1/email', () => {
    test('should return an error when no payload sent', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/email',
        method: 'POST',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true,
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400)
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('Not enough information to create an email.');
      }
    });

    test('should return an error when email exists', async () => {
      const payload: CreateEmailPayloadType = {
        code: '',
        def: false,
        email: TEST_EXISTING_EMAIL,
        label: 'Work',
        userId: TEST_EXISTING_USER_ID
      };

      const request: AxiosRequestConfig = {
        url: `/api/v1/email/`,
        method: 'POST',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true,
        data: payload
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400)
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual(`This email: ${TEST_EXISTING_EMAIL} already exists.`);
      }
    });

    test('should return an error when email is invalid', async () => {
      const payload: CreateEmailPayloadType = {
        code: '',
        def: false,
        email: 'test@080mail.com',
        label: 'Work',
        userId: TEST_EXISTING_USER_ID
      };

      const request: AxiosRequestConfig = {
        url: `/api/v1/email/`,
        method: 'POST',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true,
        data: payload
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400)
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual(`The email you provided is not valid. Please note that we do not allow disposable emails or emails that do not exist, so make sure to use a real email address.`);
      }
    });

    test('should return 200 when successfuly creates email', async () => {
      const result = await axios.request<AxiosRequestConfig, AxiosResponse<OtpResponseType>>({
        url: `/api/v1/user/send-otp-code`,
        method: 'POST',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true
      });
      const payload: CreateEmailPayloadType = {
        code: result.data.code,
        def: false,
        email: TEST_EMAIL,
        label: 'Work',
        userId: authRes.id
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/email',
        method: 'POST',
        data: payload,
        headers: {
          cookie: authUtil.cookeisRaw

        },
        withCredentials: true,
      };

      const response = await axios.request(request);

      expect(response.status).toEqual(200);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();

      idToUpdate = response.data.id;
    });
  });

  describe('PUT /api/v1/email/:id', () => {
    test('should return an error when no email exists with the id', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/email/${TEST_UUID}`,
        method: 'PUT',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true,
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400)
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual(`Email could not be found with the id: ${TEST_UUID}`);
      }
    });

    test('should return 200 when successfuly updates email', async () => {
      const payload: UpdateEmailPayloadType = {
        def: false,
        label: 'Test',
      };

      const request: AxiosRequestConfig = {
        url: `/api/v1/email/${idToUpdate}`,
        method: 'PUT',
        data: payload,
        headers: {
          cookie: authUtil.cookeisRaw

        },
        withCredentials: true,
      };

      const response = await axios.request(request);

      expect(response.status).toEqual(200);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();
    });
  });

  describe('DELETE /api/v1/email/:id', () => {
    test('should return an error when no email exists with the id', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/email/${TEST_UUID}`,
        method: 'DELETE',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true,
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400)
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual(`Email could not be found with the id: ${TEST_UUID}`);
      }
    });

    test('should return 200 when successfuly deletes email', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/email/${idToUpdate}`,
        method: 'DELETE',
        headers: {
          cookie: authUtil.cookeisRaw

        },
        withCredentials: true,
      };

      const response = await axios.request(request);

      expect(response.status).toEqual(200);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();
    });

    test('should permanently delete an email when called', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/email/test/${idToUpdate}`,
        method: 'DELETE',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true
      };

      const result = await axios.request<AxiosRequestConfig, AxiosResponse<void>>(request);

      expect(result.status).toBe(200);
    });
  });
});
