import { apiWebMain } from '@dx/rtk-query-web';

export const apiWebShortlink = apiWebMain.injectEndpoints({
  endpoints: (build) => ({
    getShortlinkTarget: build.query<string, { id: string }>({
      query: (payload) => (
        {
          url: `v1/shortlink/${payload.id}`,
          method: 'GET'
        }
      )
    }),
  }),
  overrideExisting: true
});

export const {
  useLazyGetShortlinkTargetQuery,
} = apiWebShortlink;
