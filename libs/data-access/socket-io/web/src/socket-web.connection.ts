import {
  io,
  Socket
} from 'socket.io-client';

import { WebConfigService } from '@dx/config-web';
import { store } from '@dx/store-web';

export class SocketWebConnection {
  public static createSocket<
    TServertoClient,
    TClientToServer
  >(namespace: string) {
    const URLS = WebConfigService.getWebUrls();
    let socketUrl = URLS.API_URL;

    if (namespace) {
      socketUrl = `${socketUrl}${namespace}`;
    }
    const accessToken = store.getState().auth.token;

    const socket: Socket<TServertoClient, TClientToServer> = io(socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: {
        token: accessToken
      }
    });

    return socket;
  }
}

export type SocketWebConnectionType = typeof SocketWebConnection.prototype;
