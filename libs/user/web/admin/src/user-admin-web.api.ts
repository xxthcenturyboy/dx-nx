import { apiWebMain } from '@dx/rtk-query-web';
import {
  GetUsersListQueryType,
  GetUserListResponseType,
  UpdateUserPayloadType,
  UserType
} from '@dx/user-shared';
import {
  DEFAULT_LIMIT,
  DEFAULT_OFFSET
} from '@dx/config-shared';

const buildUserAdminListUrl = (params: GetUsersListQueryType): string => {
  const limit = params.limit !== undefined
    ? params.limit
    : DEFAULT_LIMIT;
  const offset = params.offset !== undefined
    ? params.offset
    : DEFAULT_OFFSET;

  let url = `/v1/user/list?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`;

  if (params.orderBy !== undefined && params.sortDir !== undefined) {
    url += `&orderBy=${encodeURIComponent(params.orderBy)}&sortDir=${encodeURIComponent(params.sortDir)}`;
  }
  if (params.filterValue !== undefined) {
    url += `&filterValue=${encodeURIComponent(params.filterValue)}`;
  }

  return url;
};

export const apiWebUserAdmin = apiWebMain.injectEndpoints({
  endpoints: (build) => ({
    getUserAdminList: build.query<GetUserListResponseType, GetUsersListQueryType>({
      query: (payload) => (
        {
          url: buildUserAdminListUrl(payload),
          method: 'GET'
        }
      )
    }),
    getUserAdmin: build.query<UserType, string>({
      query: (payload) => ({
        url:  `/v1/user/user?id=${encodeURIComponent(payload)}}`,
        method: 'GET'
      })
    }),
    updateUser: build.mutation<{ id: string }, UpdateUserPayloadType>({
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
  useLazyGetUserAdminListQuery,
  useLazyGetUserAdminQuery,
  useUpdateUserMutation
} = apiWebUserAdmin;
