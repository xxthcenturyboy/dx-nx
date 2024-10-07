import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { CreatePhonePayloadType, UpdatePhonePayloadType } from '@dx/phone-shared';
import {
  PHONE_DEFAULT_REGION_CODE,
  TEST_COUNTRY_CODE,
  TEST_EXISTING_PHONE,
  TEST_PHONE,
  TEST_PHONE_IT_INVALID,
  TEST_PHONE_IT_VALID,
  TEST_PHONE_VALID,
  TEST_UUID,
} from '@dx/config-shared';
import {
  AuthSuccessResponseType,
  OtpResponseType
} from '@dx/auth-shared';
import { AuthUtil, AuthUtilType } from './util-v1';

describe('v1 Phone Routes', () => {
  let authRes: AuthSuccessResponseType;
  let authUtil: AuthUtilType;
  let idToUpdate: string;
  let idToUpdateItaly: string;

  beforeAll(async () => {
    authUtil = new AuthUtil();
    const login = await authUtil.login();
    if (login) {
      authRes = login;
    }
  });

  describe('POST /api/v1/phone/validate', () => {
    test('should return an error when phone is not valid', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/phone/validate',
        method: 'POST',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
        data: {
          phone: 'not a phone number',
          regionCode: 'x'
        }
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual(
          'This phone cannot be used (invalid).'
        );
      }
    });

    test('should return an error when missing data in request', async () => {
      const payload = {
        phone: TEST_EXISTING_PHONE,
        regionCode: undefined
      };

      const request: AxiosRequestConfig = {
        url: `/api/v1/phone/validate`,
        method: 'POST',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
        data: payload,
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual(
          'Missing phone or region code.'
        );
      }
    });

    test('should return an error when phone exists', async () => {
      const payload = {
        phone: TEST_EXISTING_PHONE,
        regionCode: PHONE_DEFAULT_REGION_CODE
      };

      const request: AxiosRequestConfig = {
        url: `/api/v1/phone/validate`,
        method: 'POST',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
        data: payload,
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual(
          '(858) 484-6800 is already in use.'
        );
      }
    });
  });

  describe('POST /api/v1/phone', () => {
    test('should return an error when no payload sent', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/phone',
        method: 'POST',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual(
          'Not enough information to create a phone.'
        );
      }
    });

    test('should return an error when phone exists', async () => {
      const payload: CreatePhonePayloadType = {
        code: 'code',
        countryCode: TEST_COUNTRY_CODE,
        def: false,
        phone: TEST_EXISTING_PHONE,
        regionCode: PHONE_DEFAULT_REGION_CODE,
        label: 'Work',
        userId: authRes.profile.id,
      };

      const request: AxiosRequestConfig = {
        url: `/api/v1/phone/`,
        method: 'POST',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
        data: payload,
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual(
          '(858) 484-6800 is already in use.'
        );
      }
    });

    test('should return an error when phone is invalid', async () => {
      const payload: CreatePhonePayloadType = {
        code: 'code',
        countryCode: TEST_COUNTRY_CODE,
        regionCode: PHONE_DEFAULT_REGION_CODE,
        def: false,
        phone: TEST_PHONE,
        label: 'Work',
        userId: authRes.profile.id,
      };

      const request: AxiosRequestConfig = {
        url: `/api/v1/phone/`,
        method: 'POST',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
        data: payload,
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual(
          `This phone cannot be used (invalid).`
        );
      }
    });

    test('should return an error when Italian phone is invalid', async () => {
      const payload: CreatePhonePayloadType = {
        code: 'code',
        countryCode: '39',
        regionCode: 'IT',
        def: false,
        phone: TEST_PHONE_IT_INVALID,
        label: 'Work',
        userId: authRes.profile.id,
      };

      const request: AxiosRequestConfig = {
        url: `/api/v1/phone/`,
        method: 'POST',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
        data: payload,
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual(
          `This phone cannot be used (invalid).`
        );
      }
    });

    test('should return 200 when successfuly creates Italian phone', async () => {
      const result = await axios.request<
        AxiosRequestConfig,
        AxiosResponse<OtpResponseType>
      >({
        url: `/api/v1/auth/otp-code/send/phone`,
        method: 'POST',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
        data: {
          phone: TEST_PHONE_IT_VALID,
          regionCode: 'IT'
        }
      });
      const payload: CreatePhonePayloadType = {
        code: result.data.code,
        countryCode: '39',
        regionCode: 'IT',
        def: false,
        phone: TEST_PHONE_IT_VALID,
        label: 'Work',
        userId: authRes.profile.id,
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/phone',
        method: 'POST',
        data: payload,
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
      };

      const response = await axios.request(request);

      expect(response.status).toEqual(200);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();

      idToUpdateItaly = response.data.id;
    });

    test('should return 200 when successfuly creates phone', async () => {
      const result = await axios.request<
        AxiosRequestConfig,
        AxiosResponse<OtpResponseType>
      >({
        url: `/api/v1/auth/otp-code/send/phone`,
        method: 'POST',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
        data: {
          phone: TEST_PHONE_VALID,
          regionCode: 'US'
        }
      });
      const payload: CreatePhonePayloadType = {
        code: result.data.code,
        countryCode: TEST_COUNTRY_CODE,
        regionCode: 'US',
        def: false,
        phone: TEST_PHONE_VALID,
        label: 'Work',
        userId: authRes.profile.id,
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/phone',
        method: 'POST',
        data: payload,
        headers: {
          ...authUtil.getHeaders(),
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
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual(
          `Phone could not be found with the id: ${TEST_UUID}`
        );
      }
    });

    test('should return 200 when successfuly updates email', async () => {
      const payload: UpdatePhonePayloadType = {
        id: idToUpdate,
        def: false,
        label: 'Test',
      };

      const request: AxiosRequestConfig = {
        url: `/api/v1/phone/${idToUpdate}`,
        method: 'PUT',
        data: payload,
        headers: {
          ...authUtil.getHeaders(),
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
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual(
          `Phone could not be found with the id: ${TEST_UUID}`
        );
      }
    });

    test('should return 200 when successfuly deletes phone', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/phone/${idToUpdate}`,
        method: 'DELETE',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
      };

      const response = await axios.request(request);

      expect(response.status).toEqual(200);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();
    });

    test('should permanently delete our test phones when called', async () => {
      const request1: AxiosRequestConfig = {
        url: `/api/v1/phone/test/${idToUpdate}`,
        method: 'DELETE',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
      };
      const request2: AxiosRequestConfig = {
        url: `/api/v1/phone/test/${idToUpdateItaly}`,
        method: 'DELETE',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
      };

      const result1 = await axios.request<
        AxiosRequestConfig,
        AxiosResponse<void>
      >(request1);
      const result2 = await axios.request<
        AxiosRequestConfig,
        AxiosResponse<void>
      >(request2);

      expect(result1.status).toBe(200);
      expect(result2.status).toBe(200);
    });
  });
});
