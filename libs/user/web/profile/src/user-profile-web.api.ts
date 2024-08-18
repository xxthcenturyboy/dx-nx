import { apiWebMain } from '@dx/rtk-query-web';
import {
  UpdatePasswordPayloadType,
  UserProfileStateType
} from '@dx/user-shared';

export const apiWebUserProfile = apiWebMain.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<{ profile: UserProfileStateType | string | null }, void>({
      query: () => (
        {
          url: 'v1/user/profile',
          method: 'GET'
        }
      )
    }),
    updatePassword: build.mutation<{ success: boolean }, UpdatePasswordPayloadType>({
      query: (paylaod) => (
        {
          url: `v1/user/update/password`,
          method: 'PUT',
          data: paylaod
        }
      )
    }),
  }),
  overrideExisting: true
});

export const {
  useLazyGetProfileQuery,
  useUpdatePasswordMutation
} = apiWebUserProfile;
