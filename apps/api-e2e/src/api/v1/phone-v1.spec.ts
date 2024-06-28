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
  CreatePhonePayloadType,
  UpdatePhonePayloadType
} from '@dx/phone';
import {
  TEST_COUNTRY_CODE,
  TEST_EXISTING_PHONE,
  TEST_PHONE,
  TEST_UUID
} from '@dx/config';

describe('v1 Phone Routes', () => {
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

  describe('POST /api/v1/phone', () => {
    test('should return an error when no payload sent', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/phone',
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
        expect(typedError.response.data.message).toEqual('Not enough information to create a phone.');
      }
    });

    test('should return an error when phone exists', async () => {
      const payload: CreatePhonePayloadType = {
        countryCode: TEST_COUNTRY_CODE,
        def: false,
        phone: TEST_EXISTING_PHONE,
        label: 'Work',
        userId: authRes.id
      };

      const request: AxiosRequestConfig = {
        url: `/api/v1/phone/`,
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
        expect(typedError.response.data.message).toEqual(`This phone: ${TEST_EXISTING_PHONE} already exists.`);
      }
    });

    test('should return 200 when successfuly creates phone', async () => {
      const payload: CreatePhonePayloadType = {
        countryCode: TEST_COUNTRY_CODE,
        def: false,
        phone: TEST_PHONE,
        label: 'Work',
        userId: authRes.id
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/phone',
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

  describe('PUT /api/v1/phone/:id', () => {
    test('should return an error when no phone exists with the id', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/phone/${TEST_UUID}`,
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
        expect(typedError.response.data.message).toEqual(`Phone could not be found with the id: ${TEST_UUID}`);
      }
    });

    test('should return 200 when successfuly updates email', async () => {
      const payload: UpdatePhonePayloadType = {
        def: false,
        label: 'Test',
      };

      const request: AxiosRequestConfig = {
        url: `/api/v1/phone/${idToUpdate}`,
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

  describe('DELETE /api/v1/phone/:id', () => {
    test('should return an error when no phone exists with the id', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/phone/${TEST_UUID}`,
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
        expect(typedError.response.data.message).toEqual(`Phone could not be found with the id: ${TEST_UUID}`);
      }
    });

    test('should return 200 when successfuly deletes phone', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/phone/${idToUpdate}`,
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

    test('should permanently delete a phone when called', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/phone/test/${idToUpdate}`,
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
