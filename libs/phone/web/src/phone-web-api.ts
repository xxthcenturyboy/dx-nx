import { apiWebMain } from '@dx/rtk-query-web';
import {
  CreatePhonePayloadType,
  UpdatePhonePayloadType
} from '@dx/phone-shared';

export const apiWebPhone = apiWebMain.injectEndpoints({
  endpoints: (build) => ({
    addPhone: build.mutation<{ id: string, phoneFormatted: string }, CreatePhonePayloadType>({
      query: (paylaod) => (
        {
          url: 'v1/phone',
          method: 'POST',
          data: paylaod
        }
      )
    }),
    deletePhone: build.mutation<{ id: string }, string>({
      query: (paylaod) => (
        {
          url: `v1/phone/${paylaod}`,
          method: 'DELETE',
          data: paylaod
        }
      )
    }),
    updatePhone: build.mutation<{ id: string }, UpdatePhonePayloadType>({
      query: (paylaod) => (
        {
          url: `v1/phone/${paylaod.id}`,
          method: 'PUT',
          data: paylaod
        }
      )
    }),
  }),
  overrideExisting: true
});

export const {
  useAddPhoneMutation,
  useDeletePhoneMutation,
  useUpdatePhoneMutation
} = apiWebPhone;
