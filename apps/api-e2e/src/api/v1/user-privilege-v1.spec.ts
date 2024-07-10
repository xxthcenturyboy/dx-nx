import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AuthUtil, AuthUtilType } from './util-v1';
import { UpdatePrivilegeSetPayloadType } from '@dx/user-api';
import { TEST_EXISTING_USER_PRIVILEGE_ID, TEST_UUID } from '@dx/config-shared';
import { AuthSuccessResponseType, OtpResponseType } from '@dx/auth-api';

describe('v1 User Privilege Routes', () => {
  let authRes: AuthSuccessResponseType;
  let authUtil: AuthUtilType;
  let initialDescription: string;

  beforeAll(async () => {
    authUtil = new AuthUtil();
    const login = await authUtil.login();
    if (login) {
      authRes = login;
    }
  });

  describe('GET /api/v1/privilege-set', () => {
    test('should return an array of privileges when called', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/privilege-set',
        method: 'GET',
        headers: {
          ...authUtil.getHeaders(),
        },
        withCredentials: true,
      };

      const result = await axios.request(request);

      expect(result.status).toBe(200);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data).toHaveLength(3);
      const toUpdate = result.data.find(
        (privilgeSet) => privilgeSet.id === TEST_EXISTING_USER_PRIVILEGE_ID
      );
      if (toUpdate) {
        initialDescription = toUpdate.description;
      }
    });
  });

  describe('PUT /api/v1/privilege-set/:id', () => {
    test('should return an error when no record exists with the id', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/privilege-set/${TEST_UUID}`,
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
          'No Privilege Set Found!'
        );
      }
    });

    test('should return 200 when successfuly updates description', async () => {
      const payload: UpdatePrivilegeSetPayloadType = {
        description: 'Test',
      };

      const request: AxiosRequestConfig = {
        url: `/api/v1/privilege-set/${TEST_EXISTING_USER_PRIVILEGE_ID}`,
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

    test('should return 200 when successfuly updates description to original value', async () => {
      const payload: UpdatePrivilegeSetPayloadType = {
        description: initialDescription,
      };

      const request: AxiosRequestConfig = {
        url: `/api/v1/privilege-set/${TEST_EXISTING_USER_PRIVILEGE_ID}`,
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
});
