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
  UserProfileStateType,
  UpdateUserPayloadType,
  UpdateUserResponseType,
  UpdatePasswordPayloadType
} from '@dx/user';
import {
  TEST_EXISTING_USER_ID,
  TEST_USER_CREATE,
  TEST_UUID
} from '@dx/config';
import { UpdateUsernamePayloadType } from '@dx/user';
import {
  AuthSuccessResponseType,
  OtpResponseType
} from '@dx/auth';

describe('v1 User Routes', () => {
  let authRes: AuthSuccessResponseType;
  let authUtil: AuthUtilType;
  let workingUserId: string;

  beforeAll(async () => {
    authUtil = new AuthUtil();
    const login = await authUtil.login();
    if (login) {
      authRes = login;
    }
  });

  describe('GET /api/v1/user/check/availabilty', () => {
    test('should return available = true when username is available', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/check/availabilty?username=usernameNotInSystem`,
        method: 'GET',
        headers: {
          ...authUtil.getHeaders()
        },
        withCredentials: true,
      };

      const result = await axios.request<AxiosRequestConfig, AxiosResponse<{ available: boolean}>>(request);

      expect(result.status).toBe(200);
      expect(result.data.available).toBe(true);
    });

    test('should return available = false when username is not available', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/check/availabilty?username=admin`,
        method: 'GET',
        headers: {
          ...authUtil.getHeaders()
        },
        withCredentials: true,
      };

      const result = await axios.request<AxiosRequestConfig, AxiosResponse<{ available: boolean}>>(request);

      expect(result.status).toBe(200);
      expect(result.data.available).toBe(false);
    });

    test('should return an error when username is profane', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/check/availabilty?username=asshole`,
        method: 'GET',
        headers: {
          ...authUtil.getHeaders()
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
        expect(typedError.response.data.message).toEqual('Profanity is not allowed');
      }
    });
  });

  describe('GET /api/v1/user/list', () => {
    test('should return an array of users when called', async () => {
      const request: AxiosRequestConfig = {
        url: '/api/v1/user/list',
        method: 'GET',
        headers: {
          ...authUtil.getHeaders()
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
          ...authUtil.getHeaders()
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
          ...authUtil.getHeaders()
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
          ...authUtil.getHeaders()
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
          ...authUtil.getHeaders()
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
          ...authUtil.getHeaders()
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
    test('should send an otp via email when called', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/send-otp-code`,
        method: 'POST',
        headers: {
          ...authUtil.getHeaders()
        },
        withCredentials: true
      };

      const result = await axios.request<AxiosRequestConfig, AxiosResponse<OtpResponseType>>(request);

      expect(result.status).toBe(200);
      expect(result.data.code).toBeDefined();
      expect(typeof result.data.code === 'string').toBe(true);
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
          ...authUtil.getHeaders()
        },
        withCredentials: true,
        data: payload
      };

      const result = await axios.request<AxiosRequestConfig, AxiosResponse<UpdateUserResponseType>>(request);

      expect(result.status).toBe(200);
      expect(result.data.userId).toEqual(workingUserId);
    });
  });

  describe('PUT /api/v1/user/roles-restrictions/:id', () => {
    test('should update user role when called', async () => {
      const payload: UpdateUserPayloadType = {
        roles: ['USER']
      };
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/roles-restrictions/${workingUserId}`,
        method: 'PUT',
        headers: {
          ...authUtil.getHeaders()
        },
        withCredentials: true,
        data: payload
      };

      const result = await axios.request<AxiosRequestConfig, AxiosResponse<UpdateUserResponseType>>(request);

      expect(result.status).toBe(200);
      expect(result.data.userId).toEqual(workingUserId);
    });
  });

  describe('PUT /api/v1/user/update/username/:id', () => {
    test('should update the username when called', async () => {
      const otpResponse = await axios.request<{ code: string }>({
        url: '/api/v1/auth/otp-code/send/email',
        method: 'POST',
        data: {
          email: TEST_USER_CREATE.email
        }
      });
      const authUtil = new AuthUtil();
      await authUtil.loginEmalPasswordless(TEST_USER_CREATE.email, otpResponse.data.code);

      const otpRes = await axios.request<AxiosRequestConfig, AxiosResponse<OtpResponseType>>({
        url: `/api/v1/user/send-otp-code`,
        method: 'POST',
        headers: {
          ...authUtil.getHeaders()
        },
        withCredentials: true
      });

      const payload: UpdateUsernamePayloadType = {
        otpCode: otpRes.data.code,
        username: 'test-username'
      };
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/update/username/${workingUserId}`,
        method: 'PUT',
        headers: {
          ...authUtil.getHeaders()
        },
        withCredentials: true,
        data: payload
      };

      const result = await axios.request<AxiosRequestConfig, AxiosResponse<UpdateUserResponseType>>(request);

      expect(result.status).toBe(200);
      expect(result.data.userId).toEqual(workingUserId);
    });
  });

  // describe('PUT /api/v1/user/resend/invite', () => {
  //   test('should resend an invite when called', async () => {
  //     const payload: ResendInvitePayloadType = {
  //       id: workingUserId,
  //       email: TEST_EMAIL
  //     };
  //     const request: AxiosRequestConfig = {
  //       url: `/api/v1/user/resend/invite`,
  //       method: 'PUT',
  //       headers: {
  //         ...authUtil.getHeaders()
  //       },
  //       withCredentials: true,
  //       data: payload
  //     };

  //     const result = await axios.request<AxiosRequestConfig, AxiosResponse<SendInviteResponseType>>(request);

  //     expect(result.status).toBe(200);
  //     expect(result.data.invited).toBe(true);
  //   });

  //   test('should return an error when no email is sent', async () => {
  //     const payload: ResendInvitePayloadType = {
  //       id: '',
  //       email: ''
  //     };
  //     const request: AxiosRequestConfig = {
  //       url: `/api/v1/user/resend/invite`,
  //       method: 'PUT',
  //       headers: {
  //         ...authUtil.getHeaders()
  //       },
  //       withCredentials: true,
  //       data: payload
  //     };

  //     try {
  //       expect(await axios.request(request)).toThrow();
  //     } catch (err) {
  //       const typedError = err as AxiosError;
  //       // console.log('got error', typedError);
  //       // assert
  //       expect(typedError.response.status).toBe(400);
  //       // @ts-expect-error - type is bad
  //       expect(typedError.response.data.message).toEqual('Request is invalid.');
  //     }
  //   });
  // });

  describe('PUT /api/v1/user/update/password', () => {
    let authUtilUpdate: AuthUtilType;
    let otpCode = '';
    const validPw1 = 'akjd0023kakdj_**_(';

    beforeAll(async () => {
      const otpResponse = await axios.request<{ code: string }>({
        url: '/api/v1/auth/otp-code/send/email',
        method: 'POST',
        data: {
          email: TEST_USER_CREATE.email
        }
      });
      authUtilUpdate = new AuthUtil();
      await authUtilUpdate.loginEmalPasswordless(TEST_USER_CREATE.email, otpResponse.data.code);
    });

    beforeEach(async () => {
      const otpResponse = await axios.request<AxiosRequestConfig, AxiosResponse<OtpResponseType>>({
        url: `/api/v1/user/send-otp-code`,
        method: 'POST',
        headers: {
          ...authUtilUpdate.getHeaders()
        },
        withCredentials: true
      });
      otpCode = otpResponse.data.code;
    });

    test('should update the users password when called', async () => {
      const payload: UpdatePasswordPayloadType = {
        id: workingUserId,
        password: validPw1,
        passwordConfirm: validPw1,
        otpCode: otpCode
      };
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/update/password`,
        method: 'PUT',
        headers: {
          ...authUtil.getHeaders()
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
        passwordConfirm: '',
        otpCode: ''
      };
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/update/password`,
        method: 'PUT',
        headers: {
          ...authUtilUpdate.getHeaders()
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

    test('should return an error when password is weak', async () => {
      const payload: UpdatePasswordPayloadType = {
        id: workingUserId,
        password: 'password',
        passwordConfirm: 'password',
        otpCode: otpCode
      };
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/update/password`,
        method: 'PUT',
        headers: {
          ...authUtilUpdate.getHeaders()
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
        expect(typedError.response.data.message).toContain('Please choose a stronger password');
      }
    });
  });

  describe('DELETE /api/v1/user', () => {
    test('should delete a user when called', async () => {
      const request: AxiosRequestConfig = {
        url: `/api/v1/user/${workingUserId}`,
        method: 'DELETE',
        headers: {
          ...authUtil.getHeaders()
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
          ...authUtil.getHeaders()
        },
        withCredentials: true
      };

      const result = await axios.request<AxiosRequestConfig, AxiosResponse<void>>(request);

      expect(result.status).toBe(200);
    });
  });
});
