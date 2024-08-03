import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from '@dx/data-access-axios-web';

export const apiWebMain = createApi({
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({})
});
