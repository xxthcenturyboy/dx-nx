import { apiWebMain } from '@dx/rtk-query-web';

import { NotificationType } from '@dx/notifications-shared';

export const apiWebNotifications = apiWebMain.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<NotificationType[], { userId: string }>({
      query: (payload) => (
        {
          url: `v1/notification/user/${payload.userId}`,
          method: 'GET'
        }
      )
    }),
    markAllAsDismissed: build.mutation<{ success: boolean }, { userId: string }>({
      query: (paylaod) => (
        {
          url: `v1/notification/dismiss-all/${paylaod.userId}`,
          method: 'PUT'
        }
      )
    }),
    markAsDismissed: build.mutation<{ success: boolean }, { id: string }>({
      query: (paylaod) => (
        {
          url: `v1/notification/dismiss/${paylaod.id}`,
          method: 'PUT'
        }
      )
    }),
  }),
  overrideExisting: true
});

export const {
  useLazyGetNotificationsQuery,
  useMarkAllAsDismissedMutation,
  useMarkAsDismissedMutation
} = apiWebNotifications;
