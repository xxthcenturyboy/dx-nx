import { apiWebMain } from '@dx/rtk-query-web';
import {
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
    })
  }),
  overrideExisting: true
});

export const {
  useLazyGetProfileQuery
} = apiWebUserProfile;
