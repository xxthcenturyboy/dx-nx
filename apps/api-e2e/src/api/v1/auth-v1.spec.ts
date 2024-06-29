import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';

import { AuthUtil } from './util-v1';
import {
  AccountCreationPayloadType,
  LoginPaylodType,
  SetupPasswordsPaylodType,
  UserLookupResponseType,
  USER_LOOKUPS
} from '@dx/auth';
import { UserProfileStateType } from '@dx/user';
import {
  TEST_EMAIL,
  TEST_PASSWORD,
  TEST_PHONE,
  TEST_PHONE_VALID,
  TEST_EXISTING_EMAIL,
  TEST_EXISTING_PHONE,
  TEST_EXISTING_USER_ID
} from '@dx/config';

describe('v1 Auth Routes', () => {
  let id: string;
  let cookies: string[];

  describe('GET /api/v1/auth/lookup', () => {
    test('should return available when queried with a non-existent phone', async () => {
      // arrange
      let response: AxiosResponse<string, UserLookupResponseType>;
      const expectedResult: UserLookupResponseType = { available: true };
      const url = `/api/v1/auth/lookup?code=1&value=${TEST_PHONE_VALID}&type=${USER_LOOKUPS.PHONE}`
      // act
      response = await axios.get(url);
      // assert
      expect(response.status).toBe(200);
      expect(response.data).toEqual(expectedResult);
    });

    test('should return unavailable when queried with an existing phone', async () => {
      // arrange
      let response: AxiosResponse<string, UserLookupResponseType>;
      const expectedResult: UserLookupResponseType = { available: false };
      const url = `/api/v1/auth/lookup?code=1&value=${TEST_EXISTING_PHONE}&type=${USER_LOOKUPS.PHONE}`;
      // act
      response = await axios.get(url);
      // assert
      expect(response.status).toBe(200);
      expect(response.data).toEqual(expectedResult);
    });

    test('should return an error when queried with an invalid phone.', async () => {
      // arrange
      const url = `/api/v1/auth/lookup?code=1&value=${TEST_PHONE}&type=${USER_LOOKUPS.PHONE}`;
      // act
      try {
        expect(await axios.get(url)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // console.log('got error', typedError);
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('Error in auth lookup handler: This phone cannot be used.');
      }
    });

    test('should return available when queried with a non-existent email', async () => {
      // arrange
      let response: AxiosResponse<string, UserLookupResponseType>;
      const expectedResult: UserLookupResponseType = { available: true };
      const url = `/api/v1/auth/lookup?value=${TEST_EMAIL}&type=${USER_LOOKUPS.EMAIL}`
      // act
      response = await axios.get(url);
      // assert
      expect(response.status).toBe(200);
      expect(response.data).toEqual(expectedResult);
    });

    test('should return unavailable when queried with an existing email', async () => {
      // arrange
      let response: AxiosResponse<string, UserLookupResponseType>;
      const expectedResult: UserLookupResponseType = { available: false };
      const url = `/api/v1/auth/lookup?value=${TEST_EXISTING_EMAIL}&type=${USER_LOOKUPS.EMAIL}`;
      // act
      response = await axios.get(url);
      // assert
      expect(response.status).toBe(200);
      expect(response.data).toEqual(expectedResult);
    });

    test('should return an error when queried with an invalid email.', async () => {
      // arrange
      const url = `/api/v1/auth/lookup?code=1&value=not-a-valid-email&type=${USER_LOOKUPS.EMAIL}`;
      // act
      try {
        expect(await axios.get(url)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // console.log('got error', typedError);
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('Error in auth lookup handler: Invalid Email.');
      }
    });

    test('should return an error when queried with a disposable email.', async () => {
      // arrange
      const url = `/api/v1/auth/lookup?code=1&value=email@080mail.com&type=${USER_LOOKUPS.EMAIL}`;
      // act
      try {
        expect(await axios.get(url)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // console.log('got error', typedError);
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('Error in auth lookup handler: Invalid email domain.');
      }
    });
  });

  describe('POST /api/v1/auth/account', () => {
    afterEach(async () => {
      if (id) {
        if (!cookies) {
          const authUtil = new AuthUtil();
          await authUtil.login();
          cookies = authUtil.cookeisRaw;
        }

        const request: AxiosRequestConfig = {
          url: `/api/v1/user/test/${id}`,
          method: 'DELETE',
          headers: {
            cookie: cookies
          },
          withCredentials: true
        };

        await axios.request<AxiosRequestConfig, AxiosResponse<void>>(request);
      }
    });

    test('should return an error when sent with no value.', async () => {
      // arrange
      const payload: AccountCreationPayloadType = {
        value: ''
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/account',
        method: 'POST',
        data: payload
      };
      // act
      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // console.log('got error', typedError);
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('No data sent.');
      }
    });

    test('should return an error when sent with an invalid email.', async () => {
      // arrange
      const payload: AccountCreationPayloadType = {
        value: 'not-a-valid-email'
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/account',
        method: 'POST',
        data: payload
      };
      // act
      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // console.log('got error', typedError);
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual(`Account could not be created with payload: ${JSON.stringify(payload, null, 2)}`);
      }
    });

    test('should return an error when sent with an existing email.', async () => {
      // arrange
      const payload: AccountCreationPayloadType = {
        value: TEST_EXISTING_EMAIL
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/account',
        method: 'POST',
        data: payload
      };
      // act
      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // console.log('got error', typedError);
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('Email is unavailable.');
      }
    });

    test('should return an error when sent with an invalid phone.', async () => {
      // arrange
      const payload: AccountCreationPayloadType = {
        value: TEST_PHONE
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/account',
        method: 'POST',
        data: payload
      };
      // act
      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // console.log('got error', typedError);
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual(`Account could not be created with payload: ${JSON.stringify(payload, null, 2)}`);
      }
    });

    test('should return an error when sent with an existing phone.', async () => {
      // arrange
      const payload: AccountCreationPayloadType = {
        value: TEST_EXISTING_PHONE
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/account',
        method: 'POST',
        data: payload
      };
      // act
      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // console.log('got error', typedError);
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('Phone is unavailable.');
      }
    });

    test('should return user profile when successfully create account with email', async () => {
      const payload: AccountCreationPayloadType = {
        value: TEST_EMAIL
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/account',
        method: 'POST',
        data: payload
      };

      const response = await axios.request<UserProfileStateType>(request);
      id = response.data.id;

      expect(response.status).toEqual(200);
      expect(response.data.emails).toHaveLength(1);
    });

    test('should return user profile when successfully create account with phone', async () => {
      const payload: AccountCreationPayloadType = {
        value: TEST_PHONE_VALID
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/account',
        method: 'POST',
        data: payload
      };

      const response = await axios.request<UserProfileStateType>(request);
      id = response.data.id;

      expect(response.status).toEqual(200);
      expect(response.data.phones).toHaveLength(1);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    test('should return an error when email does not exist', async () => {
      const paylod: LoginPaylodType = {
        email: 'not-in-this-system@useless.com',
        password: TEST_PASSWORD
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
        method: 'POST',
        data: paylod
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('This is not a valid username.');
      }
    });

    test('should return an error when password is incorrect', async () => {
      const paylod: LoginPaylodType = {
        email: TEST_EXISTING_EMAIL,
        password: TEST_PASSWORD
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
        method: 'POST',
        data: paylod
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('Incorrect username or password.');
      }
    });

    test('should return user profile when login is successful', async () => {
      const paylod: LoginPaylodType = {
        email: TEST_EXISTING_EMAIL,
        password: 'advancedbasics1'
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
        method: 'POST',
        data: paylod
      };

      const response = await axios.request<UserProfileStateType>(request);

      expect(response.status).toEqual(200);
      expect(response.data).toBeDefined();
      expect(response.data.id).toEqual(TEST_EXISTING_USER_ID);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    test('should return true on successful logout', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/logout',
        method: 'POST'
      };

      const response = await axios.request<{ loggedOut: boolean }>(request);

      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ loggedOut: true });
    });
  });

  describe('POST /api/v1/auth/otp-code/send', () => {
    test('should return fals when sent with an invalid phone', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/otp-code/send',
        method: 'POST',
        data: {
          phone: TEST_PHONE
        }
      };

      const response = await axios.request<boolean>(request);

      expect(response.status).toEqual(200);
      expect(response.data).toBe(false);
    });

    test('should return true when sent with valid phone', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/otp-code/send',
        method: 'POST',
        data: {
          phone: TEST_PHONE_VALID
        }
      };

      const response = await axios.request<boolean>(request);

      expect(response.status).toEqual(200);
      expect(response.data).toBe(true);
    });
  });

  describe('POST /api/v1/auth/otp-lockout', () => {
    test('should return an error when no id is sent', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/otp-lockout',
        method: 'POST',
        data: { id: '' }
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('Request is invalid.');
      }
    });

    test('should return an error when no id is not in system', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/otp-lockout',
        method: 'POST',
        data: { id: '4d2269d3-9bfc-4f2d-b66c-ab63ea1d2c6f' }
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toContain('Error in OTP Lockout handler:');
      }
    });
  });

  describe('POST /api/v1/auth/refresh-token', () => {
    test('should logout because cannot test the refresh on this yet - too dumb', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/refresh-token',
        method: 'POST',
        headers: {
          cookies: ['refresh=refresh-token']
        }
      };

      const response = await axios.request<{ loggedOut: boolean }>(request);

      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ loggedOut: true });
    });
  });

  describe('POST /api/v1/auth/request-reset', () => {
    test('should return error when email does not exist', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/request-reset',
        method: 'POST',
        data: {
          email: TEST_EMAIL
        }
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toContain('Could not find');
      }
    });

    test('should return error when email was not sent', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/request-reset',
        method: 'POST',
        data: {
          email: ''
        }
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('Request is invalid.');
      }
    });
  });

  describe('PUT /api/v1/auth/setup-password', () => {
    test('should return an error with a bad ID', async () => {
      // arrange
      const payload: SetupPasswordsPaylodType = {
        id: '4d2269d3-9bfc-4f2d-b66c-ab63ea1d2c6f',
        password: TEST_PASSWORD,
        securityAA: 'Answer',
        securityQQ: 'Question'
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/setup-password',
        method: 'PUT',
        data: payload
      };

      try {
        // act
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toContain('Error in auth setup password:');
      }
    });
  });
});
