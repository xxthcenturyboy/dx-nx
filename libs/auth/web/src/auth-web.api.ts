// import { apiWebMain } from '@dx/store-web';
// import {
//   LoginPayloadType,
//   LogoutResponse,
//   AuthSuccessResponseType
// } from '@dx/auth-shared';

// export const apiWebAuth = apiWebMain.injectEndpoints({
//   endpoints: (build) => ({
//     login: build.mutation<AuthSuccessResponseType, LoginPayloadType>({
//       query: (paylaod) => (
//         {
//           url: 'v1/auth/login',
//           method: 'POST',
//           data: paylaod
//         }
//       )
//     }),
//     logout: build.mutation<LogoutResponse, void>({
//       query: () => (
//         {
//           url: 'v1/auth/logout',
//           method: 'POST'
//         }
//       ),
//       transformResponse: (response: LogoutResponse) => {
//         return response;
//       }
//     })
//   }),
//   overrideExisting: false
// });

// export const {
//   useLoginMutation,
//   useLogoutMutation,
// } = apiWebAuth;
