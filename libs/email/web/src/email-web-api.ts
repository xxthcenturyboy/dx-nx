import { apiWebMain } from '@dx/rtk-query-web';
import {
  CreateEmailPayloadType,
  UpdateEmailPayloadType
} from '@dx/email-shared';

export const apiWebEmail = apiWebMain.injectEndpoints({
  endpoints: (build) => ({
    addEmail: build.mutation<{ id: string }, CreateEmailPayloadType>({
      query: (paylaod) => (
        {
          url: 'v1/email',
          method: 'POST',
          data: paylaod
        }
      )
    }),
    checkEmailAvailability: build.mutation<{ isAvailable: boolean }, string>({
      query: (paylaod) => (
        {
          url: 'v1/email/validate',
          method: 'POST',
          data: { email: paylaod }
        }
      )
    }),
    deleteEmail: build.mutation<{ id: string }, string>({
      query: (paylaod) => (
        {
          url: `v1/email/${encodeURIComponent(paylaod)}`,
          method: 'DELETE'
        }
      )
    }),
    deleteEmailProfile: build.mutation<{ id: string }, string>({
      query: (paylaod) => (
        {
          url: `v1/email/user-profile/${encodeURIComponent(paylaod)}`,
          method: 'DELETE'
        }
      )
    }),
    updateEmail: build.mutation<{ id: string }, UpdateEmailPayloadType>({
      query: (paylaod) => (
        {
          url: `v1/email/${encodeURIComponent(paylaod.id)}`,
          method: 'PUT',
          data: paylaod
        }
      )
    }),
  }),
  overrideExisting: true
});

export const {
  useAddEmailMutation,
  useCheckEmailAvailabilityMutation,
  useDeleteEmailMutation,
  useDeleteEmailProfileMutation,
  useUpdateEmailMutation
} = apiWebEmail;
