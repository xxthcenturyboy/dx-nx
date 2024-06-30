import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';

import {
  AccountCreationPayloadType,
  LoginPaylodType,
  UserLookupResponseType,
  USER_LOOKUPS
} from '@dx/auth';
import { AuthUtil } from './util-v1';
import { UserProfileStateType } from '@dx/user';
import {
  TEST_EMAIL,
  TEST_PASSWORD,
  TEST_EXISTING_EMAIL,
  TEST_EXISTING_PHONE,
  TEST_EXISTING_USER_ID,
  TEST_PHONE_VALID,
  TEST_PHONE
} from '@dx/config';

describe('v1 Auth Flow', () => {
  let emailAccountId: string;
  let phoneAccountId: string;
  let cookies: string[];

  afterAll(async () => {
    if (
      emailAccountId
      || phoneAccountId
    ) {
      const authUtil = new AuthUtil();
      await authUtil.login();
      cookies = authUtil.cookeisRaw;

      if (emailAccountId) {
        const removeEmailAccountRequest: AxiosRequestConfig = {
          url: `/api/v1/user/test/${emailAccountId}`,
          method: 'DELETE',
          headers: {
            cookie: cookies
          },
          withCredentials: true
        };
        await axios.request<AxiosRequestConfig, AxiosResponse<void>>(removeEmailAccountRequest);
      }

      if (phoneAccountId) {
        const removePhoneAccountRequest: AxiosRequestConfig = {
          url: `/api/v1/user/test/${phoneAccountId}`,
          method: 'DELETE',
          headers: {
            cookie: cookies
          },
          withCredentials: true
        };
        await axios.request<AxiosRequestConfig, AxiosResponse<void>>(removePhoneAccountRequest);
      }

    }
  });

  describe('Check Email or Phone for availability', () => {
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

  describe('Send OTP to Phone/Email for confirmation prior to creating account or logging in.', () => {
    test('should return false when sent with an invalid phone', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/otp-code/send/phone',
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
        url: '/api/v1/auth/otp-code/send/phone',
        method: 'POST',
        data: {
          phone: TEST_PHONE_VALID
        }
      };

      const response = await axios.request<boolean>(request);

      expect(response.status).toEqual(200);
      expect(response.data).toBe(true);
    });

    test('should return false when sent with an invalid email', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/otp-code/send/email',
        method: 'POST',
        data: {
          email: TEST_EMAIL
        }
      };

      const response = await axios.request(request);

      expect(response.status).toEqual(200);
      expect(response.data).toBe(false);
    });

    test('should return true when sent with valid email', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/otp-code/send/email',
        method: 'POST',
        data: {
          email: TEST_EXISTING_EMAIL
        }
      };

      const response = await axios.request(request);

      expect(response.status).toEqual(200);
      expect(response.data).toBe(false);
    });
  });

  describe('Create Account', () => {
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
        code: 'OU812',
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
        code: 'OU812',
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
      emailAccountId = response.data.id;

      expect(response.status).toEqual(200);
      expect(response.data.emails).toHaveLength(1);
    });

    test('should return user profile when successfully create account with phone', async () => {
      const payload: AccountCreationPayloadType = {
        code: 'OU812',
        value: TEST_PHONE_VALID
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/account',
        method: 'POST',
        data: payload
      };

      const response = await axios.request<UserProfileStateType>(request);
      phoneAccountId = response.data.id;

      expect(response.status).toEqual(200);
      expect(response.data.phones).toHaveLength(1);
    });
  });

  describe('Validate Email', () => {
    test('should return an error when sent with an invalid email.', async () => {
      // arrange
      const payload: AccountCreationPayloadType = {
        value: 'not-a-valid-email'
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/validate/email/413c78fb890955a86d3971828dd05a9b2d844e44d8a30d406f80bf6e79612bb97e8b3b5834c8dbebdf5c4dadc767a579',
        method: 'GET'
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
        expect(typedError.response.data.message).toEqual('Token is invalid');
      }
    });
  });

  describe('Log In', () => {
    test('should return an error when sent with an email that does not have an account.', async () => {
      // arrange
      const payload: LoginPaylodType = {
        value: 'not-in-this-system@useless.com'
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
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
        expect(typedError.response.data.message).toEqual('Could not log you in.');
      }
    });

    test('should return an error when sent with a phone that does not have an account.', async () => {
      // arrange
      const payload: LoginPaylodType = {
        code: 'OU812',
        value: '8584846802'
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
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
        expect(typedError.response.data.message).toEqual('Could not log you in.');
      }
    });

    test('should return an error when password is incorrect.', async () => {
      // arrange
      const payload: LoginPaylodType = {
        value: TEST_EXISTING_EMAIL,
        password: 'bad-password'
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
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
        expect(typedError.response.data.message).toEqual('Could not log you in.');
      }
    });

    test('should return user profile when successfully logged in with email, passwordless login', async () => {
      const payload: LoginPaylodType = {
        value: TEST_EXISTING_EMAIL
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
        method: 'POST',
        data: payload
      };

      const response = await axios.request<UserProfileStateType>(request);

      expect(response.status).toEqual(200);
      expect(response.data.emails).toHaveLength(1);
    });

    test('should return user profile when successfully logged in with email / password', async () => {
      const payload: LoginPaylodType = {
        value: TEST_EXISTING_EMAIL,
        password: 'advancedbasics1'
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
        method: 'POST',
        data: payload
      };

      const response = await axios.request<UserProfileStateType>(request);

      expect(response.status).toEqual(200);
      expect(response.data.emails).toHaveLength(1);
    });

    test('should return user profile when successfully logged in with phone', async () => {
      const payload: LoginPaylodType = {
        code: 'OU812',
        value: TEST_EXISTING_PHONE
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
        method: 'POST',
        data: payload
      };

      const response = await axios.request<UserProfileStateType>(request);

      expect(response.status).toEqual(200);
      expect(response.data.phones).toHaveLength(1);
    });
  });

  describe('Logout', () => {
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
});
