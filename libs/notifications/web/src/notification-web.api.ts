import { apiWebMain } from '@dx/rtk-query-web';

import {
  // NotificationSocketClientToServerEvents,
  // NotificationSocketServerToClientEvents,
  NotificationCreationParamTypes,
  NotificationType,
  // NOTIFICATION_WEB_SOCKET_NS
} from '@dx/notifications-shared';
// import { SocketWebConnection } from '@dx/data-access-socket-io-web';

// export class NotificationSockets {
//   public static getSocket (userId: string) {
//     const socket = SocketWebConnection.createSocket<
//       NotificationSocketServerToClientEvents,
//       NotificationSocketClientToServerEvents
//     >(`${NOTIFICATION_WEB_SOCKET_NS}/${userId}`);

//     return socket;
//   }
// }

export const apiWebNotifications = apiWebMain.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<{ system: NotificationType[], user: NotificationType[] }, { userId: string }>({
      query: (payload) => (
        {
          url: `v1/notification/user/${payload.userId}`,
          method: 'GET'
        }
      ),
      // async onCacheEntryAdded(
      //   paylaod,
      //   { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      // ) {
      //   const socket = NotificationSockets.getSocket(paylaod.userId);
      //   const connected = new Promise<void> (resolve => socket.on('connect', resolve));

      //   const listener = (data: NotificationType) => {
      //     updateCachedData((currentCacheData) => {
      //       currentCacheData.push(data);
      //     })
      //   };

      //   try {
      //     await cacheDataLoaded;
      //     await connected;
      //     socket.on('sendNotification', listener);
      //   } catch (err){
      //     console.error(err);
      //   }

      //   await cacheEntryRemoved;
      //   socket.removeListener('sendNotification', listener);
      // }
    }),

    markAllAsDismissed: build.mutation<{ success: boolean }, { userId: string }>({
      query: (paylaod) => (
        {
          url: `v1/notification/dismiss-all/${paylaod.userId}`,
          method: 'PUT'
        }
      )
    }),

    markAsDismissed: build.mutation<{ success: boolean }, { id: string, userId: string }>({
      query: (paylaod) => (
        {
          url: `v1/notification/dismiss/${paylaod.id}/${paylaod.userId}`,
          method: 'PUT'
        }
      )
    }),

    sendNotificationAppUpdate: build.mutation<{ success: boolean }, void>({
      query: () => (
        {
          url: `v1/notification/app-update`,
          method: 'POST'
        }
      )
    }),

    sendNotificationToAll: build.mutation<{ success: boolean }, Partial<NotificationCreationParamTypes>>({
      query: (paylaod) => (
        {
          url: `v1/notification/all-users`,
          method: 'POST',
          data: paylaod
        }
      )
    }),

    sendNotificationToUser: build.mutation<{ success: boolean }, NotificationCreationParamTypes>({
      query: (paylaod) => (
        {
          url: `v1/notification/user`,
          method: 'POST',
          data: paylaod
        }
      )
    }),

    testSockets: build.mutation<{ success: boolean }, { userId: string }>({
      query: (paylaod) => (
        {
          url: `v1/notification/test/${paylaod.userId}`,
          method: 'POST'
        }
      )
    }),
  }),

  overrideExisting: true
});

export const fetchNotifications = apiWebNotifications.endpoints.getNotifications;

export const {
  useLazyGetNotificationsQuery,
  useMarkAllAsDismissedMutation,
  useMarkAsDismissedMutation,
  useSendNotificationAppUpdateMutation,
  useSendNotificationToAllMutation,
  useSendNotificationToUserMutation,
  useTestSocketsMutation
} = apiWebNotifications;
