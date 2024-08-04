import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from './axios-web.api';

export const apiWebMain = createApi({
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({})
});
