import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse
} from 'axios';

import {
  UserLookupResponseType,
  USER_LOOKUPS
} from '@dx/auth';
import { SignupPayloadType } from 'libs/auth/src/model/auth.types';

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
      const url = `/api/v1/auth/lookup?code=1&value=2131112222&type=${USER_LOOKUPS.PHONE}`;
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
      const url = `/api/v1/auth/lookup?value=du.dx.software@gmail.com&type=${USER_LOOKUPS.EMAIL}`;
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
    test('should return a message when queried', async () => {
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

  describe('POST /api/v1/auth/signup', () => {
    const STRONG_PW = 'ajf349234jla_(@kaldj';
    test('should return an error when email not sent', async () => {
      const paylod: SignupPayloadType = {
        email: '',
        password: 'password',
        passwordConfirm: 'password'
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
        email: 'test@email.com',
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
        email: 'test@email.com',
        password: 'password',
        passwordConfirm: 'password'
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
        email: 'du.dx.software@gmail.com',
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
});
