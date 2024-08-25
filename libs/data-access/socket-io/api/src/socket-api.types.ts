import { Server } from 'http';

export type SocketApiConnectionConstructorType = {
  httpServer: Server;
}

export type SocketApiServiceConstructorType = {

} & SocketApiConnectionConstructorType;
