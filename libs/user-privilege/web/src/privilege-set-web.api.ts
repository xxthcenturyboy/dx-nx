import { apiWebMain } from '@dx/rtk-query-web';
import {
  PrivilegeSetDataType
} from '@dx/user-privilege-shared';

export const apiWebPrivilegeSets = apiWebMain.injectEndpoints({
  endpoints: (build) => ({
    getPrivilegeSets: build.query<PrivilegeSetDataType[], void>({
      query: () => (
        {
          url: '/v1/privilege-set',
          method: 'GET'
        }
      )
    }),
  }),
  overrideExisting: true
});

export const {
  useLazyGetPrivilegeSetsQuery
} = apiWebPrivilegeSets;
