import { Socket } from 'socket.io-client';

import {
  store
} from '@dx/store-web';
import {
  NotificationSocketClientToServerEvents,
  NotificationSocketServerToClientEvents,
  NOTIFICATION_SOCKET_NS
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
      >(NOTIFICATION_SOCKET_NS);
    NotificationWebSockets.#instance = this;

    this.socket.on('sendNotification', (notification) => {
      store.dispatch(notificationActions.addNotification(notification));
    });
  }

  public static get instance () {
    return this.#instance;
  }
}

export type NotificationWebSocketsType = typeof NotificationWebSockets.prototype;
