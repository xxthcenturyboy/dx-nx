import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';

import {
  UserLookupResponseType,
  USER_LOOKUPS
} from '@dx/auth';
import {
  LoginPaylodType,
  SetupPasswordsPaylodType,
  SignupPayloadType
} from 'libs/auth/src/model/auth.types';
import { UserProfileStateType } from '@dx/user';
import {
  TEST_EMAIL,
  TEST_PASSWORD,
  TEST_EXISTING_EMAIL,
  TEST_EXISTING_PHONE,
  TEST_EXISTING_USER_ID
} from '@dx/config';

describe('v1 Auth Routes', () => {
  describe('GET /api/v1/auth/lookup', () => {
    test('should return available when queried with a non-existent phone', async () => {
      // arrange
      let response: AxiosResponse<string, UserLookupResponseType>;
      const expectedResult: UserLookupResponseType = { available: true };
      const url = `/api/v1/auth/lookup?code=1&value=2131112221&type=${USER_LOOKUPS.PHONE}`
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

    test('should return available when queried with a non-existent email', async () => {
      // arrange
      let response: AxiosResponse<string, UserLookupResponseType>;
      const expectedResult: UserLookupResponseType = { available: true };
      const url = `/api/v1/auth/lookup?value=dud.dx.software@gmail.com&type=${USER_LOOKUPS.EMAIL}`
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

    test('should return available when queried with a non-existent username', async () => {
      // arrange
      let response: AxiosResponse<string, UserLookupResponseType>;
      const expectedResult: UserLookupResponseType = { available: true };
      const url = `/api/v1/auth/lookup?value=administrator&type=${USER_LOOKUPS.USERNAME}`
      // act
      response = await axios.get(url);
      // assert
      expect(response.status).toBe(200);
      expect(response.data).toEqual(expectedResult);
    });

    test('should return unavailable when queried with an existing username', async () => {
      // arrange
      let response: AxiosResponse<string, UserLookupResponseType>;
      const expectedResult: UserLookupResponseType = { available: false };
      const url = `/api/v1/auth/lookup?value=admin&type=${USER_LOOKUPS.USERNAME}`;
      // act
      response = await axios.get(url);
      // assert
      expect(response.status).toBe(200);
      expect(response.data).toEqual(expectedResult);
    });
  });

  describe('GET /api/v1/auth/token-invite', () => {
    test('should return an error when queried with an expired token.', async () => {
      // arrange
      const url = `/api/v1/auth/token-invite?token=413c78fb890955a86d3971828dd05a9b2d844e44d8a30d406f80bf6e79612bb97e8b3b5834c8dbebdf5c4dadc767a579`;
      // act
      try {
        expect(await axios.get(url)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // console.log('got error', typedError);
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('Error in auth get user by token handler: Token has expired.');
      }
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

  describe('POST /api/v1/auth/signup', () => {
    const STRONG_PW = 'ajf349234jla_(@kaldj';
    test('should return an error when email not sent', async () => {
      const paylod: SignupPayloadType = {
        email: '',
        password: TEST_PASSWORD,
        passwordConfirm: TEST_PASSWORD
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/signup',
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
        expect(typedError.response.data.message).toEqual('Email is required.');
      }
    });

    test('should return an error when passwords do not match', async () => {
      const paylod: SignupPayloadType = {
        email: TEST_EMAIL,
        password: 'password0',
        passwordConfirm: 'password1'
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/signup',
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
        expect(typedError.response.data.message).toEqual('Passwords must match.');
      }
    });

    test('should return an error when password is weak', async () => {
      const paylod: SignupPayloadType = {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        passwordConfirm: TEST_PASSWORD
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/signup',
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
        expect(typedError.response.data.message).toContain('Please choose a stronger password.');
      }
    });

    test('should return an error when email is not available', async () => {
      const paylod: SignupPayloadType = {
        email: TEST_EXISTING_EMAIL,
        password: STRONG_PW,
        passwordConfirm: STRONG_PW
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/signup',
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
        expect(typedError.response.data.message).toContain('Email is already taken.');
      }
    });

    test('should return an error when email is invalid', async () => {
      const paylod: SignupPayloadType = {
        email: 'invalid email',
        password: STRONG_PW,
        passwordConfirm: STRONG_PW
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/signup',
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
        expect(typedError.response.data.message).toContain('invalid email does not appear to be a valid email.');
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
