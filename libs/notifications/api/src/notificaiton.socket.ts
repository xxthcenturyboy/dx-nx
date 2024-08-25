import { SocketApiConnection } from "@dx/data-access-socket-io-api";
import { Server } from "socket.io";

const socket = SocketApiConnection.instance;

socket.io.of('/notify').on('connection', () => {});
