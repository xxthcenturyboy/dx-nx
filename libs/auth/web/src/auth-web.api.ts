import { IZXCVBNResult } from 'zxcvbn-typescript';

import {
  apiWebMain,
  CustomResponseErrorType
} from '@dx/rtk-query-web';
import {
  LoginPayloadType,
  LogoutResponse,
  AuthSuccessResponseType
} from '@dx/auth-shared';
import { getAuthApiErrors } from './auth-web-api-errors';

function transformAuthApiError(response: CustomResponseErrorType): CustomResponseErrorType {
  const AUTH_API_ERRORS = getAuthApiErrors();

  if (response.code === '100') {
    return {
      ...response,
      error: AUTH_API_ERRORS[response.code] || response.error
    }
  }

  return response;
}

export const apiWebAuth = apiWebMain.injectEndpoints({
  endpoints: (build) => ({
    checkPasswordStrength: build.mutation<IZXCVBNResult, { password: string }>({
      query: (payload) => (
        {
          url: 'v1/auth/password-strength',
          method: 'POST',
          data: payload
        }
      ),
      transformErrorResponse: transformAuthApiError
    }),
    login: build.mutation<AuthSuccessResponseType, LoginPayloadType>({
      query: (payload) => (
        {
          url: 'v1/auth/login',
          method: 'POST',
          data: payload
        }
      ),
      transformErrorResponse: transformAuthApiError
    }),
    logout: build.mutation<LogoutResponse, void>({
      query: () => (
        {
          url: 'v1/auth/logout',
          method: 'POST'
        }
      ),
      transformResponse: (response: LogoutResponse) => {
        return response;
      },
      transformErrorResponse: transformAuthApiError
    }),
    otpRequestEmail: build.mutation<{ code?: string }, { email: string }>({
      query: (payload) => (
        {
          url: 'v1/auth/otp-code/send/email',
          method: 'POST',
          data: payload
        }
      ),
      transformErrorResponse: transformAuthApiError
    }),
    otpRequestPhone: build.mutation<{ code?: string }, { phone: string; regionCode?: string }>({
      query: (payload) => (
        {
          url: 'v1/auth/otp-code/send/phone',
          method: 'POST',
          data: payload
        }
      ),
      transformErrorResponse: transformAuthApiError
    })
  }),
  overrideExisting: false
});

export const {
  useCheckPasswordStrengthMutation,
  useLoginMutation,
  useLogoutMutation,
  useOtpRequestEmailMutation,
  useOtpRequestPhoneMutation
} = apiWebAuth;
