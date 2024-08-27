import { Namespace } from 'socket.io';

import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger-api';
import {
  ensureLoggedInSocket,
  getUserIdFromHandshake,
  SocketApiConnection,
  SocketApiConnectionType
} from '@dx/data-access-socket-io-api';
import {
  NotificationSocketClientToServerEvents,
  NotificationSocketData,
  NotificationSocketInterServerEvents,
  NotificationSocketServerToClientEvents,
  NotificationType,
  NOTIFICATION_SOCKET_NS
} from '@dx/notifications-shared';

type NotificationNamespaceType =  Namespace<
  NotificationSocketClientToServerEvents,
  NotificationSocketServerToClientEvents,
  NotificationSocketInterServerEvents,
  NotificationSocketData
>;

export class NotificationSocketApiService {
  static #instance: NotificationSocketApiServiceType;
  socket: SocketApiConnectionType;
  private logger: ApiLoggingClassType;
  public ns: NotificationNamespaceType;

  constructor() {
    this.logger = ApiLoggingClass.instance;
    this.socket = SocketApiConnection.instance;
    // @ts-expect-error - type is fine
    this.ns = this.socket.io.of(NOTIFICATION_SOCKET_NS);
    NotificationSocketApiService.#instance = this;
  }

  public static get instance () {
    return this.#instance;
  }

  public configureNamespace () {
    // set up auth middleware
    this.ns.use((socket, next) => {
      const isLoggedIn = ensureLoggedInSocket(socket.handshake);
      if (isLoggedIn) {
        next();
      } else {
        next(new Error(`Not logged in`));
      }
    });

    this.ns.on('connection', (socket) => {
      const userId = getUserIdFromHandshake(socket.handshake);
      if (userId) {
        socket.join(userId);
        this.logger.logInfo(`notify socket user: ${userId}`);
      }
    });
  }

  public sendNotification(notification: NotificationType) {
    try {
      if (notification.userId) {
        this.ns.to(notification.userId).emit('sendNotification', notification);
      }
    } catch (err) {
      this.logger.logError(`Error sending notification socket: ${err.message}`);
    }
  }
}

export type NotificationSocketApiServiceType = typeof NotificationSocketApiService.prototype;
