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
    deleteEmail: build.mutation<{ id: string }, string>({
      query: (paylaod) => (
        {
          url: `v1/email/${paylaod}`,
          method: 'DELETE',
          data: paylaod
        }
      )
    }),
    updateEmail: build.mutation<{ id: string }, UpdateEmailPayloadType>({
      query: (paylaod) => (
        {
          url: `v1/email/${paylaod.id}`,
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
  useDeleteEmailMutation,
  useUpdateEmailMutation
} = apiWebEmail;
