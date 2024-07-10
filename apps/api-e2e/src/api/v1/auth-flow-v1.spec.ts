import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import {
  AccountCreationPayloadType,
  AuthSuccessResponseType,
  LoginPaylodType,
  UserLookupResponseType,
  USER_LOOKUPS,
  AUTH_TOKEN_NAMES,
} from '@dx/auth-api';
import {
  TEST_DEVICE,
  TEST_EMAIL,
  TEST_EXISTING_EMAIL,
  TEST_EXISTING_PHONE,
  TEST_PHONE_VALID,
  TEST_PHONE,
  TEST_UUID,
} from '@dx/config-shared';
import { dxRsaGenerateKeyPair, dxRsaSignPayload } from '@dx/util-encryption';
import { DeviceModelType } from '@dx/devices-api';
import { AuthUtil, AuthUtilType } from './util-v1';

const errorLogSpyMock = jest
  .spyOn(console, 'error')
  .mockImplementation(() => {});

describe('v1 Auth Flow', () => {
  let authUtil: AuthUtilType;
  let deviceId: string;
  let emailAccountId: string;
  let emailAuthToken: string;
  let emailRefreshToken: string;
  let otpEmail: string;
  let otpPhone: string;
  let phoneAccountId: string;
  let phoneAuthToken: string;
  let phoneRefreshToken: string;
  const generatedKeys = dxRsaGenerateKeyPair();
  const rsaKeyPair = {
    privateKey: generatedKeys.privateKey,
    publicKey: generatedKeys.publicKey,
  };

  beforeAll(async () => {
    authUtil = new AuthUtil();
    await authUtil.login();
  });

  afterAll(async () => {
    if (emailAccountId || phoneAccountId) {
      const authUtil = new AuthUtil();
      await authUtil.login();

      if (emailAccountId) {
        const removeEmailAccountRequest: AxiosRequestConfig = {
          url: `/api/v1/user/test/${emailAccountId}`,
          method: 'DELETE',
          headers: {
            ...authUtil.getHeaders(),
          },
          withCredentials: true,
        };
        await axios.request<AxiosRequestConfig, AxiosResponse<void>>(
          removeEmailAccountRequest
        );
      }

      if (phoneAccountId) {
        const removePhoneAccountRequest: AxiosRequestConfig = {
          url: `/api/v1/user/test/${phoneAccountId}`,
          method: 'DELETE',
          headers: {
            ...authUtil.getHeaders(),
          },
          withCredentials: true,
        };
        await axios.request<AxiosRequestConfig, AxiosResponse<void>>(
          removePhoneAccountRequest
        );
      }
    }
    errorLogSpyMock.mockRestore();
  });

  describe('Check Email or Phone for availability', () => {
    test('should return available when queried with a non-existent phone', async () => {
      // arrange
      let response: AxiosResponse<string, UserLookupResponseType>;
      const expectedResult: UserLookupResponseType = { available: true };
      const url = `/api/v1/auth/lookup?code=1&value=${TEST_PHONE_VALID}&type=${USER_LOOKUPS.PHONE}`;
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
        expect(typedError.response.data.message).toEqual(
          'Error in auth lookup handler: This phone cannot be used.'
        );
      }
    });

    test('should return available when queried with a non-existent email', async () => {
      // arrange
      let response: AxiosResponse<string, UserLookupResponseType>;
      const expectedResult: UserLookupResponseType = { available: true };
      const url = `/api/v1/auth/lookup?value=${TEST_EMAIL}&type=${USER_LOOKUPS.EMAIL}`;
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
        expect(typedError.response.data.message).toEqual(
          'Error in auth lookup handler: Invalid Email.'
        );
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
        expect(typedError.response.data.message).toEqual(
          'Error in auth lookup handler: Invalid email domain.'
        );
      }
    });
  });

  describe('Send OTP to Phone/Email for confirmation prior to creating account or logging in.', () => {
    test('should return empty string when sent with an invalid phone', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/otp-code/send/phone',
        method: 'POST',
        data: {
          phone: TEST_PHONE,
        },
      };

      const response = await axios.request<{ code: string }>(request);

      expect(response.status).toEqual(200);
      expect(response.data.code).toBeUndefined();
    });

    test('should return code when sent with valid phone', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/otp-code/send/phone',
        method: 'POST',
        data: {
          phone: TEST_PHONE_VALID,
        },
      };

      const response = await axios.request<{ code: string }>(request);

      expect(response.status).toEqual(200);
      expect(response.data.code).toBeTruthy();

      otpPhone = response.data.code;
    });

    test('should return empty string when sent with an invalid email', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/otp-code/send/email',
        method: 'POST',
        data: {
          email: 'not-a-valid-email',
        },
      };

      const response = await axios.request<{ code: string }>(request);

      expect(response.status).toEqual(200);
      expect(response.data.code).toBeUndefined();
    });

    test('should return code when sent with valid email', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/otp-code/send/email',
        method: 'POST',
        data: {
          email: TEST_EMAIL,
        },
      };

      const response = await axios.request<{ code: string }>(request);

      expect(response.status).toEqual(200);
      expect(response.data.code).toBeTruthy();

      otpEmail = response.data.code;
    });
  });

  describe('Create Account', () => {
    test('should return an error when sent with no value.', async () => {
      // arrange
      const payload: AccountCreationPayloadType = {
        code: '',
        value: '',
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/account',
        method: 'POST',
        data: payload,
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
        expect(typedError.response.data.message).toEqual('Bad data sent.');
      }
    });

    test('should return an error when sent with an invalid email.', async () => {
      // arrange
      const payload: AccountCreationPayloadType = {
        code: 'OU812',
        value: 'not-a-valid-email',
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/account',
        method: 'POST',
        data: payload,
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
        expect(typedError.response.data.message).toEqual(
          `Account could not be created with payload: ${JSON.stringify(
            payload,
            null,
            2
          )}`
        );
      }
    });

    test('should return an error when sent with an existing email.', async () => {
      // arrange
      const payload: AccountCreationPayloadType = {
        code: 'OU812',
        value: TEST_EXISTING_EMAIL,
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/account',
        method: 'POST',
        data: payload,
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
        expect(typedError.response.data.message).toEqual(
          'Email is unavailable.'
        );
      }
    });

    test('should return an error when sent with an invalid phone.', async () => {
      // arrange
      const payload: AccountCreationPayloadType = {
        code: 'OU812',
        value: TEST_PHONE,
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/account',
        method: 'POST',
        data: payload,
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
        expect(typedError.response.data.message).toEqual(
          `Account could not be created with payload: ${JSON.stringify(
            payload,
            null,
            2
          )}`
        );
      }
    });

    test('should return an error when sent with an existing phone.', async () => {
      // arrange
      const payload: AccountCreationPayloadType = {
        code: 'OU812',
        value: TEST_EXISTING_PHONE,
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/account',
        method: 'POST',
        data: payload,
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
        expect(typedError.response.data.message).toEqual(
          'Phone is unavailable.'
        );
      }
    });

    test('should return user profile when successfully create account with email', async () => {
      const payload: AccountCreationPayloadType = {
        code: otpEmail,
        value: TEST_EMAIL,
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/account',
        method: 'POST',
        data: payload,
      };

      const response = await axios.request<AuthSuccessResponseType>(request);
      emailAccountId = response.data.profile.id;
      emailAuthToken = response.data.accessToken;
      const cookie = (response.headers['set-cookie'] as string[])
        .find((cookie) => cookie.includes(AUTH_TOKEN_NAMES.REFRESH))
        ?.match(new RegExp(`^${AUTH_TOKEN_NAMES.REFRESH}=(.+?);`))?.[1];
      // console.log('cookie', cookie);
      emailRefreshToken = cookie;

      expect(response.status).toEqual(200);
      expect(response.data.accessToken).toBeDefined();
      expect(response.data.profile.emails).toHaveLength(1);
    });

    test('should return user profile when successfully create account with phone', async () => {
      const payload: AccountCreationPayloadType = {
        code: otpPhone,
        device: TEST_DEVICE,
        value: TEST_PHONE_VALID,
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/account',
        method: 'POST',
        data: payload,
      };

      const response = await axios.request<AuthSuccessResponseType>(request);
      phoneAccountId = response.data.profile.id;
      phoneAuthToken = response.data.accessToken;
      const cookie = (response.headers['set-cookie'] as string[])
        .find((cookie) => cookie.includes(AUTH_TOKEN_NAMES.REFRESH))
        ?.match(new RegExp(`^${AUTH_TOKEN_NAMES.REFRESH}=(.+?);`))?.[1];
      // console.log('cookie', cookie);
      phoneRefreshToken = cookie;
      deviceId = response.data.profile.device.id;

      expect(response.status).toEqual(200);
      expect(response.data.accessToken).toBeDefined();
      expect(response.data.profile.phones).toHaveLength(1);
    });
  });

  describe('[Authenticated]: Add biometric public key to device', () => {
    test('should throw when no data is sent', async () => {
      // arrange
      const payload: {
        uniqueDeviceId: string;
        biometricPublicKey: string;
      } = {
        uniqueDeviceId: '',
        biometricPublicKey: '',
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/device/biometric/public-key',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${phoneAuthToken}`,
          cookie: [`${AUTH_TOKEN_NAMES.REFRESH}=${phoneRefreshToken}`],
        },
        data: payload,
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
        expect(typedError.response.data.message).toEqual(
          'Update Public Key: Insufficient data to complete request.'
        );
      }
    });

    test('should throw when no device exists with the id', async () => {
      // arrange
      const payload: {
        uniqueDeviceId: string;
        biometricPublicKey: string;
      } = {
        uniqueDeviceId: TEST_UUID,
        biometricPublicKey: rsaKeyPair.publicKey,
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/device/biometric/public-key',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${phoneAuthToken}`,
          cookie: [`${AUTH_TOKEN_NAMES.REFRESH}=${phoneRefreshToken}`],
        },
        data: payload,
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
        expect(typedError.response.data.message).toEqual(
          'Update Public Key: Could not find the device to update.'
        );
      }
    });

    test('should return device when updated', async () => {
      // arrange
      const payload: {
        uniqueDeviceId: string;
        biometricPublicKey: string;
      } = {
        uniqueDeviceId: TEST_DEVICE.uniqueDeviceId,
        biometricPublicKey: rsaKeyPair.publicKey,
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/device/biometric/public-key',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${phoneAuthToken}`,
          cookie: [`${AUTH_TOKEN_NAMES.REFRESH}=${phoneRefreshToken}`],
        },
        data: payload,
      };
      // act
      const response = await axios.request<DeviceModelType>(request);
      // assert
      expect(response.status).toEqual(200);
      expect(response.data.uniqueDeviceId).toEqual(TEST_DEVICE.uniqueDeviceId);
      expect(response.data.biomAuthPubKey).toEqual(rsaKeyPair.publicKey);
    });
  });

  describe('[Authenticated]: Add FCM Token to device', () => {
    test('should throw when no data is sent', async () => {
      // arrange
      const payload: {
        fcmToken: string;
      } = {
        fcmToken: '',
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/device/fcm-token',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${phoneAuthToken}`,
          cookie: [`${AUTH_TOKEN_NAMES.REFRESH}=${phoneRefreshToken}`],
        },
        data: payload,
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
        expect(typedError.response.data.message).toEqual(
          'Update FCM Token: Insufficient data to complete request.'
        );
      }
    });

    test('should throw when no device is connected to the user', async () => {
      // arrange
      const payload: {
        fcmToken: string;
      } = {
        fcmToken: TEST_UUID,
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/device/fcm-token',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${emailAuthToken}`,
          cookie: [`${AUTH_TOKEN_NAMES.REFRESH}=${emailRefreshToken}`],
        },
        data: payload,
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
        expect(typedError.response.data.message).toEqual(
          'Update FCM Token: No device connected.'
        );
      }
    });

    test('should return device when updated', async () => {
      // arrange
      const payload: {
        fcmToken: string;
      } = {
        fcmToken: TEST_UUID,
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/device/fcm-token',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${phoneAuthToken}`,
          cookie: [`${AUTH_TOKEN_NAMES.REFRESH}=${phoneRefreshToken}`],
        },
        data: payload,
      };
      // act
      const response = await axios.request<DeviceModelType>(request);
      // assert
      expect(response.status).toEqual(200);
      expect(response.data.uniqueDeviceId).toEqual(TEST_DEVICE.uniqueDeviceId);
      expect(response.data.biomAuthPubKey).toEqual(rsaKeyPair.publicKey);
    });
  });

  // describe('Validate Email', () => {
  //   test('should return an error when sent with an invalid email.', async () => {
  //     // arrange
  //     const request: AxiosRequestConfig = {
  //       url: '/api/v1/auth/validate/email/413c78fb890955a86d3971828dd05a9b2d844e44d8a30d406f80bf6e79612bb97e8b3b5834c8dbebdf5c4dadc767a579',
  //       method: 'GET'
  //     };
  //     // act
  //     try {
  //       expect(await axios.request(request)).toThrow();
  //     } catch (err) {
  //       const typedError = err as AxiosError;
  //       // console.log('got error', typedError);
  //       // assert
  //       expect(typedError.response.status).toBe(400);
  //       // @ts-expect-error - type is bad
  //       expect(typedError.response.data.message).toEqual('Token is invalid');
  //     }
  //   });
  // });

  describe('Log In', () => {
    test('should return an error when sent with a phone that does not have an account.', async () => {
      // arrange
      const payload: LoginPaylodType = {
        code: otpPhone,
        value: '8584846802',
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
        method: 'POST',
        data: payload,
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
        expect(typedError.response.data.message).toEqual(
          'Could not log you in.'
        );
      }
    });

    test('should return an error when sent with an invalid otp code via phone login', async () => {
      // arrange
      const payload: LoginPaylodType = {
        code: 'InvalidCode',
        value: TEST_PHONE_VALID,
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
        method: 'POST',
        data: payload,
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
        expect(typedError.response.data.message).toEqual(
          'Could not log you in.'
        );
      }
    });

    test('should return an error when sent with an email that does not have an account.', async () => {
      // arrange
      const payload: LoginPaylodType = {
        code: otpEmail,
        value: 'not-in-this-system@useless.com',
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
        method: 'POST',
        data: payload,
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
        expect(typedError.response.data.message).toEqual(
          'Could not log you in.'
        );
      }
    });

    test('should return an error when sent with an invalid otp code via email login.', async () => {
      // arrange
      const payload: LoginPaylodType = {
        code: 'InvalidCode',
        value: TEST_EMAIL,
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
        method: 'POST',
        data: payload,
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
        expect(typedError.response.data.message).toEqual(
          'Could not log you in.'
        );
      }
    });

    test('should return an error when password is incorrect via email login.', async () => {
      // arrange
      const payload: LoginPaylodType = {
        value: TEST_EXISTING_EMAIL,
        password: 'bad-password',
      };

      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
        method: 'POST',
        data: payload,
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
        expect(typedError.response.data.message).toEqual(
          'Could not log you in.'
        );
      }
    });

    test('should return user profile when successfully logged in with email, passwordless login', async () => {
      const otpResponse = await axios.request<{ code: string }>({
        url: '/api/v1/auth/otp-code/send/email',
        method: 'POST',
        data: {
          email: TEST_EMAIL,
        },
      });

      const payload: LoginPaylodType = {
        code: otpResponse.data.code,
        value: TEST_EMAIL,
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
        method: 'POST',
        data: payload,
      };

      const response = await axios.request<AuthSuccessResponseType>(request);
      emailAuthToken = response.data.accessToken;
      const cookie = (response.headers['set-cookie'] as string[])
        .find((cookie) => cookie.includes(AUTH_TOKEN_NAMES.REFRESH))
        ?.match(new RegExp(`^${AUTH_TOKEN_NAMES.REFRESH}=(.+?);`))?.[1];
      // console.log('cookie', cookie);
      emailRefreshToken = cookie;

      expect(response.status).toEqual(200);
      expect(response.data.accessToken).toBeDefined();
      expect(response.data.profile.emails).toHaveLength(1);
    });

    test('should return user profile when successfully logged in with email / password', async () => {
      const payload: LoginPaylodType = {
        value: TEST_EXISTING_EMAIL,
        password: 'advancedbasics1',
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
        method: 'POST',
        data: payload,
      };

      const response = await axios.request<AuthSuccessResponseType>(request);

      expect(response.status).toEqual(200);
      expect(response.data.accessToken).toBeDefined();
      expect(response.data.profile.emails).toHaveLength(1);
      expect(response.data.profile.phones).toHaveLength(1);
    });

    test('should return user profile when successfully logged in with phone', async () => {
      const otpResonse = await axios.request<{ code: string }>({
        url: '/api/v1/auth/otp-code/send/phone',
        method: 'POST',
        data: {
          phone: TEST_PHONE_VALID,
        },
      });

      const payload: LoginPaylodType = {
        code: otpResonse.data.code,
        value: TEST_PHONE_VALID,
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
        method: 'POST',
        data: payload,
        withCredentials: true,
      };

      const response = await axios.request<AuthSuccessResponseType>(request);
      phoneAuthToken = response.data.accessToken;
      const cookie = (response.headers['set-cookie'] as string[])
        .find((cookie) => cookie.includes(AUTH_TOKEN_NAMES.REFRESH))
        ?.match(new RegExp(`^${AUTH_TOKEN_NAMES.REFRESH}=(.+?);`))?.[1];
      // console.log('cookie', cookie);
      phoneRefreshToken = cookie;

      expect(response.status).toEqual(200);
      expect(response.data.accessToken).toBeDefined();
      expect(response.data.profile.phones).toHaveLength(1);
    });

    test('should return user profile when successfully logged in with device biometrics', async () => {
      const payload: LoginPaylodType = {
        biometric: {
          device: TEST_DEVICE,
          signature: dxRsaSignPayload(rsaKeyPair.privateKey, TEST_PHONE_VALID),
          userId: phoneAccountId,
        },
        value: TEST_PHONE_VALID,
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
        method: 'POST',
        data: payload,
        withCredentials: true,
      };

      const response = await axios.request<AuthSuccessResponseType>(request);
      phoneAuthToken = response.data.accessToken;
      const cookie = (response.headers['set-cookie'] as string[])
        .find((cookie) => cookie.includes(AUTH_TOKEN_NAMES.REFRESH))
        ?.match(new RegExp(`^${AUTH_TOKEN_NAMES.REFRESH}=(.+?);`))?.[1];
      // console.log('cookie', cookie);
      phoneRefreshToken = cookie;

      expect(response.status).toEqual(200);
      expect(response.data.accessToken).toBeDefined();
      expect(response.data.profile.phones).toHaveLength(1);
    });

    test('should return an error when sent with userId that has no biometrics', async () => {
      // arrange
      const payload: LoginPaylodType = {
        biometric: {
          device: TEST_DEVICE,
          signature: dxRsaSignPayload(rsaKeyPair.privateKey, TEST_PHONE_VALID),
          userId: emailAccountId,
        },
        value: TEST_PHONE_VALID,
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
        method: 'POST',
        data: payload,
        withCredentials: true,
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
        expect(typedError.response.data.message).toEqual(
          `BiometricLogin: User ${emailAccountId} has no stored public key.`
        );
      }
    });

    test('should return an error when signature cannot be validated', async () => {
      // arrange
      const payload: LoginPaylodType = {
        biometric: {
          device: TEST_DEVICE,
          signature: dxRsaSignPayload(rsaKeyPair.privateKey, 'invalid payload'),
          userId: phoneAccountId,
        },
        value: TEST_PHONE_VALID,
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/login',
        method: 'POST',
        data: payload,
        withCredentials: true,
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
        expect(typedError.response.data.message).toEqual(
          `BiometricLogin: Device signature is invalid: ${rsaKeyPair.publicKey}, userid: ${phoneAccountId}`
        );
      }
    });
  });

  describe('Refresh Tokens', () => {
    test('should throw when sent with an invalid access token', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/refresh-token',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${phoneAuthToken}`,
          cookie: [`${AUTH_TOKEN_NAMES.REFRESH}=invalid-jwt`],
        },
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // console.log('got error', typedError);
        // assert
        expect(typedError.response.status).toBe(401);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('Invalid token.');
      }
    });

    test('should return a new accessToken when called with valid refresh token', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/refresh-token',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${phoneAuthToken}`,
          cookie: [`${AUTH_TOKEN_NAMES.REFRESH}=${phoneRefreshToken}`],
        },
        withCredentials: true,
      };

      const response = await axios.request<{ accessToken: string }>(request);
      phoneAuthToken = response.data.accessToken;
      // console.log(response.headers['set-cookie'] as string[]);
      const cookie = (response.headers['set-cookie'] as string[])
        .find((cookie) => cookie.includes(AUTH_TOKEN_NAMES.REFRESH))
        ?.match(new RegExp(`^${AUTH_TOKEN_NAMES.REFRESH}=(.+?);`))?.[1];
      // console.log('cookie', cookie);
      phoneRefreshToken = cookie;

      expect(response.status).toEqual(200);
      expect(response.data.accessToken).toBeDefined();
    });
  });

  describe('[Authenticated]: Disconnect Device', () => {
    test('should throw when no device exists', async () => {
      // arrange
      const request: AxiosRequestConfig = {
        url: `/api/v1/device/disconnect/${TEST_UUID}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${phoneAuthToken}`,
          cookie: [`${AUTH_TOKEN_NAMES.REFRESH}=${phoneRefreshToken}`],
        },
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
        expect(typedError.response.data.message).toEqual('Device not found.');
      }
    });

    test('should return message when device disconnected', async () => {
      // arrange
      const request: AxiosRequestConfig = {
        url: `/api/v1/device/disconnect/${deviceId}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${phoneAuthToken}`,
          cookie: [`${AUTH_TOKEN_NAMES.REFRESH}=${phoneRefreshToken}`],
        },
      };
      // act
      const response = await axios.request<{ message: string }>(request);
      // assert
      expect(response.status).toEqual(200);
      expect(response.data.message).toEqual('Device disconnected.');
    });
  });

  describe('[Authenticated]: Logout', () => {
    test('should return true on successful logout', async () => {
      const headers = {
        Authorization: `Bearer ${phoneAuthToken}`,
        cookie: [`${AUTH_TOKEN_NAMES.REFRESH}=${phoneRefreshToken}`],
      };
      const request: AxiosRequestConfig = {
        url: '/api/v1/auth/logout',
        method: 'POST',
        headers: headers,
      };

      const response = await axios.request<{ loggedOut: boolean }>(request);

      expect(response.status).toEqual(200);
      expect(response.data).toEqual({ loggedOut: true });
    });
  });
});
