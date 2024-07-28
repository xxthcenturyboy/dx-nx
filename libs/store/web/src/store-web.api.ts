import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from '@dx/data-access-axios-web';

export const apiWebMain = createApi({
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({})
});
