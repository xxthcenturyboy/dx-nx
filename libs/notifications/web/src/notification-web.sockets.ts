import { Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

import {
  store
} from '@dx/store-web';
import {
  NotificationSocketClientToServerEvents,
  NotificationSocketServerToClientEvents,
  NOTIFICATION_WEB_SOCKET_NS
} from '@dx/notifications-shared';
import { SocketWebConnection } from '@dx/data-access-socket-io-web';
import { notificationActions } from './notification-web.reducer';

export class NotificationWebSockets {
  static #instance: NotificationWebSocketsType;
  socket: Socket<
    NotificationSocketServerToClientEvents,
    NotificationSocketClientToServerEvents
  >;

  constructor() {
    this.socket = SocketWebConnection.createSocket<
      NotificationSocketClientToServerEvents,
      NotificationSocketServerToClientEvents
    >(NOTIFICATION_WEB_SOCKET_NS);
    NotificationWebSockets.#instance = this;

    this.socket.on('sendAppUpdateNotification', (message) => {
      toast.info(message, {
        autoClose: false,
        closeButton: true,
        closeOnClick: false,
        // onClose: () => {
        //   window && window.location.reload();
        // },
        position: 'top-center',
        theme: 'colored'
      })
    });

    this.socket.on('sendNotification', (notification) => {
      store.dispatch(notificationActions.addNotification(notification));
    });
  }

  public static get instance () {
    return this.#instance;
  }
}

export type NotificationWebSocketsType = typeof NotificationWebSockets.prototype;
