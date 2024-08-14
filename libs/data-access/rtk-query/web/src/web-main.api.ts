import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from './axios-web.api';
import { BaseQueryFnType } from './axios-web.types';

export const apiWebMain = createApi({
  // baseQuery: axiosBaseQuery() as BaseQueryFnType,
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({})
});
