import { apiWebMain } from '@dx/rtk-query-web';
import { HealthzStatusType } from '@dx/healthz-shared';

export const statsWebHealthz = apiWebMain.injectEndpoints({
  endpoints: (build) => ({
    getApiHealthz: build.query<HealthzStatusType, void>({
      query: () => (
        {
          url: 'healthz',
          method: 'GET'
        }
      )
    }),
  }),
  overrideExisting: true
});

export const {
  useLazyGetApiHealthzQuery,
} = statsWebHealthz;
