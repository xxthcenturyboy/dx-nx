import { apiWebMain } from '@dx/rtk-query-web';
import {
  LoginPayloadType,
  LogoutResponse,
  AuthSuccessResponseType
} from '@dx/auth-shared';

export const apiWebAuth = apiWebMain.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthSuccessResponseType, LoginPayloadType>({
      query: (payload) => (
        {
          url: 'v1/auth/login',
          method: 'POST',
          data: payload
        }
      )
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
      }
    }),
    otpRequestEmail: build.mutation<{ code?: string }, { email: string }>({
      query: (payload) => (
        {
          url: 'v1/auth/otp-code/send/email',
          method: 'POST',
          data: payload
        }
      )
    }),
    otpRequestPhone: build.mutation<{ code?: string }, { phone: string; regionCode?: string }>({
      query: (payload) => (
        {
          url: 'v1/auth/otp-code/send/phone',
          method: 'POST',
          data: payload
        }
      )
    })
  }),
  overrideExisting: false
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useOtpRequestEmailMutation,
  useOtpRequestPhoneMutation
} = apiWebAuth;
