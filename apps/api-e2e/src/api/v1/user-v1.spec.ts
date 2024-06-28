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
  CreateUserResponseType,
  GetUserProfileReturnType,
  GetUserListResponseType,
  GetUserResponseType,
  OtpCodeResponseType,
  ResendInvitePayloadType,
  SendInviteResponseType,
  UserProfileStateType,
  UpdateUserPayloadType,
  UpdateUserResponseType,
  UpdatePasswordPayloadType,

} from '@dx/user';
import {
  TEST_EMAIL,
  TEST_EXISTING_EMAIL,
  TEST_EXISTING_PASSWORD,
  TEST_EXISTING_USER_ID,
  TEST_PASSWORD,
  TEST_USER_CREATE,
  TEST_UUID
} from '@dx/config';

describe('v1 User Routes', () => {
  let authRes: UserProfileStateType;
  let authUtil: AuthUtilType;
  let workingUserId: string;

  beforeAll(async () => {
    authUtil = new AuthUtil();
    const login = await authUtil.login();
    if (login) {
      authRes = login;
    }
  });

  describe('GET /api/v1/user/list', () => {
    test('should return an array of users when called', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/user/list',
        method: 'GET',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true,
      };

      const result = await axios.request<AxiosRequestConfig, AxiosResponse<GetUserListResponseType>>(request);

      expect(result.status).toBe(200);
      expect(result.data.count).toBeTruthy();
      expect(Array.isArray(result.data.rows)).toBe(true);
      expect(result.data.rows.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/v1/user/user/:id', () => {
    test('should return a user when called', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/user/${TEST_EXISTING_USER_ID}`,
        method: 'GET',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true,
      };

      const result = await axios.request<AxiosRequestConfig, AxiosResponse<GetUserResponseType>>(request);

      expect(result.status).toBe(200);
      expect(result.data.id).toEqual(TEST_EXISTING_USER_ID);
    });

    test('should return an error when queried with an id for a non-existent user', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/user/${TEST_UUID}`,
        method: 'GET',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true,
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // console.log('got error', typedError);
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('Search for user failed.');
      }
    });
  });

  describe('GET /api/v1/user/profile', () => {
    test('should return a profile when called', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/profile`,
        method: 'GET',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true,
      };

      const result = await axios.request<AxiosRequestConfig, AxiosResponse<GetUserProfileReturnType>>(request);

      expect(result.status).toBe(200);
      expect((result.data.profile as UserProfileStateType).id).toEqual(TEST_EXISTING_USER_ID);
    });
  });

  describe('POST /api/v1/user', () => {
    test('should create a user when called', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/user`,
        method: 'POST',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true,
        data: TEST_USER_CREATE
      };

      const result = await axios.request<AxiosRequestConfig, AxiosResponse<CreateUserResponseType>>(request);

      expect(result.status).toBe(200);
      expect(result.data.id).toBeDefined();

      workingUserId = result.data.id;
    });

    test('should return an error when no email is sent', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/user`,
        method: 'POST',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true,
        data: {
          ...TEST_USER_CREATE,
          email: '',
          username: ''
        }
      };

      try {
        expect(await axios.request(request)).toThrow();
      } catch (err) {
        const typedError = err as AxiosError;
        // console.log('got error', typedError);
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('Not enough information to create a user.');
      }
    });
  });

  describe('POST /api/v1/user/send-otp-code', () => {
    afterAll(async () => {
      const payload = {
        email: TEST_EXISTING_EMAIL
      };
      const request: AxiosRequestConfig = {
        url: `/api/v1/email/test/validate-email`,
        method: 'POST',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true,
        data: payload
      };

      await axios.request<AxiosRequestConfig, AxiosResponse<void>>(request);
    });

    test('should send an otp via email when called', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/send-otp-code`,
        method: 'POST',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true
      };

      const result = await axios.request<AxiosRequestConfig, AxiosResponse<OtpCodeResponseType>>(request);

      expect(result.status).toBe(200);
      expect(result.data.codeSent).toBe(true);
    });
  });

  describe('PUT /api/v1/user/:id', () => {
    test('should update a user when called', async () => {
      const payload: UpdateUserPayloadType = {
        firstName: 'John',
        lastName: 'Hancock'
      };
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/${workingUserId}`,
        method: 'PUT',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true,
        data: payload
      };

      const result = await axios.request<AxiosRequestConfig, AxiosResponse<UpdateUserResponseType>>(request);

      expect(result.status).toBe(200);
      expect(result.data.userId).toEqual(workingUserId);
    });
  });

  describe('PUT /api/v1/user/resend/invite', () => {
    test('should resend an invite when called', async () => {
      const payload: ResendInvitePayloadType = {
        id: workingUserId,
        email: TEST_EMAIL
      };
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/resend/invite`,
        method: 'PUT',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true,
        data: payload
      };

      const result = await axios.request<AxiosRequestConfig, AxiosResponse<SendInviteResponseType>>(request);

      expect(result.status).toBe(200);
      expect(result.data.invited).toBe(true);
    });

    test('should return an error when no email is sent', async () => {
      const payload: ResendInvitePayloadType = {
        id: '',
        email: ''
      };
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/resend/invite`,
        method: 'PUT',
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
        // console.log('got error', typedError);
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('Request is invalid.');
      }
    });
  });

  describe('PUT /api/v1/user/update/password', () => {
    let otpCode = '';

    beforeAll(async () => {
      const getOtpCodeRequest: AxiosRequestConfig = {
        url: `/api/v1/user/test/otp/${TEST_EXISTING_USER_ID}`,
        method: 'GET',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true
      };
      const result = await axios.request<AxiosRequestConfig, AxiosResponse<string>>(getOtpCodeRequest);
      if (result.data) {
        otpCode = result.data
      }

      const setupPasswordRequest: AxiosRequestConfig = {
        url: '/api/v1/auth/setup-password',
        method: 'PUT',
        data: {
          id: workingUserId,
          password: TEST_PASSWORD,
          securityAA: 'Answer',
          securityQQ: 'Question'
        }
      };
      await axios.request(setupPasswordRequest)
    });

    test('should update the users password when called', async () => {
      const payload: UpdatePasswordPayloadType = {
        id: TEST_EXISTING_USER_ID,
        password: TEST_EXISTING_PASSWORD,
        oldPassword: TEST_EXISTING_PASSWORD,
        otpCode: otpCode
      };
      console.log(otpCode);
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/update/password`,
        method: 'PUT',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true,
        data: payload
      };

      const result = await axios.request<AxiosRequestConfig, AxiosResponse<{ success: boolean }>>(request);

      expect(result.status).toBe(200);
      expect(result.data.success).toBe(true);
    });

    test('should return an error when incomplete data is sent', async () => {
      const payload: UpdatePasswordPayloadType = {
        id: workingUserId,
        password: '',
        oldPassword: '',
        otpCode: ''
      };
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/update/password`,
        method: 'PUT',
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
        // console.log('got error', typedError);
        // assert
        expect(typedError.response.status).toBe(400);
        // @ts-expect-error - type is bad
        expect(typedError.response.data.message).toEqual('Request is invalid.');
      }
    });
  });



  describe('DELETE /api/v1/user', () => {
    test('should delete a user when called', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/${workingUserId}`,
        method: 'DELETE',
        headers: {
          cookie: authUtil.cookeisRaw
        },
        withCredentials: true
      };

      const result = await axios.request<AxiosRequestConfig, AxiosResponse<{ userId: string }>>(request);

      expect(result.status).toBe(200);
      expect(result.data.userId).toEqual(workingUserId);
    });

    test('should permanently delete a user when called', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/test/${workingUserId}`,
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
