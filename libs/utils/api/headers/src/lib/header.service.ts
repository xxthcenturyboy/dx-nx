import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import { Handshake } from 'socket.io/dist/socket';

export class HeaderService {
  public static getTokenFromRequest(req: Request) {
    let token: string;

    const authHeader = req.headers['authorization'];
    if (authHeader) {
      token = authHeader.split('Bearer ')[1];
    }

    return token;
  }

  public static getTokenFromHandshake(handshake: Handshake) {
    if (
      handshake.headers
      && handshake.headers.authorization
    ) {
      return handshake.headers.authorization.split('Bearer ')[1];
    }

    if (handshake.auth.token) {
      return handshake.auth.token;
    }

    return '';
  }
}
