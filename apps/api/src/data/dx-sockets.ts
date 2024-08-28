import { Server } from 'http';

import { SocketApiConnection } from '@dx/data-access-socket-io-api';
import { NotificationSocketApiService } from '@dx/notifications-api';
import { ApiLoggingClass } from '@dx/logger-api';

export class DxSocketClass {
  public static startSockets(httpServer: Server) {
    const logger = ApiLoggingClass.instance;
    if (!httpServer) {
      logger.logError('No Server provided to socket connector. Sockets not initiated.');
      return false;
    }

    try {
      const socket = new SocketApiConnection({ httpServer });
      if (
        !SocketApiConnection.instance
        || !socket.io
      ) {
        logger.logError('Sockets did not instantiate correctly. Sockets unavailable');
        return false;
      }

      new NotificationSocketApiService();

      if (NotificationSocketApiService.instance) {
        NotificationSocketApiService.instance.configureNamespace();
        logger.logInfo('Sockets started successfully');
        return true;
      }

      logger.logError('Notification sockets not instantiated.');
      return false;
    } catch (err) {
      logger.logError((err as Error).message, err);
      return false;
    }
  }
}
