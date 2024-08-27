import { Handshake } from 'socket.io/dist/socket';

import { HeaderService } from '@dx/utils-api-headers';
import { TokenService } from '@dx/auth-api';
import { ApiLoggingClass } from '@dx/logger-api';

export function getUserIdFromHandshake(handshake: Handshake): string {
  try {
    const token = HeaderService.getTokenFromHandshake(handshake);
    if (!token) {
      throw new Error('No Token in handshake.');
    }

    const userId = TokenService.getUserIdFromToken(token);
    if (!userId) {
      throw new Error('Token invalid or expired from handshake.');
    }

    return userId;
  } catch (err) {
    const msg = err.message || err;
    ApiLoggingClass.instance.logError(`Failed to get userId from handshake: ${msg}`);
    return '';
  }
}

export function ensureLoggedInSocket(handshake: Handshake) {
  try {
    const userId = getUserIdFromHandshake(handshake);
    return !!userId;
  } catch (err) {
    const msg = err.message || err;
    ApiLoggingClass.instance.logError(`Failed to authenticate socket token: ${msg}`);
    return false;
  }
}
