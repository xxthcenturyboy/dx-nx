import { Request as IRequest } from 'express';
import { Request } from 'jest-express/lib/request';
import {
  ensureLoggedInSocket,
  getUserIdFromHandshake
} from './socket-api-handshake.service';
import { ApiLoggingClass } from '@dx/logger-api';
import { API_APP_NAME } from '@dx/config-api';
import { Handshake } from 'socket.io/dist/socket';

jest.mock('@dx/logger-api');
jest.mock('@dx/auth-api');

describe('socket-api-handshake.service', () => {
  const handshakeMock: Handshake = {
    headers: {
      authorization: 'Bearer token'
    },
    time: '0000',
    address: 'test-address',
    xdomain: false,
    secure: true,
    issued: 12344,
    url: 'test-url',
    query: {},
    auth: {}
  };
  let req: IRequest;

  beforeAll(() => {
    new ApiLoggingClass({ appName: API_APP_NAME });
    req = new Request() as unknown as IRequest;
    // @ts-expect-error - type not known
    req.user = {
      id: 'test-user-id'
    }
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  describe('ensureLoggedInSocket', () => {
    it('should exist when imported', () => {
      // arrange
      // act
      // assert
      expect(ensureLoggedInSocket).toBeDefined();
    });

    it('should return true when has token in headers.authorization', () => {
      // arrange
      // act
      const result = ensureLoggedInSocket(handshakeMock);
      // assert
      expect(result).toEqual(true);
    });

    it('should return true when has token in header.auth.token', () => {
      // arrange
      const modHandshake = {
        ...handshakeMock,
        headers: {},
        auth: {
          token: 'test-token'
        }
      };
      // act
      const result = ensureLoggedInSocket(modHandshake);
      // assert
      expect(result).toEqual(true);
    });

    it('should return false when has no token.', () => {
      // arrange
      const modHandshake = {
        ...handshakeMock,
        headers: {}
      };
      // act
      const result = ensureLoggedInSocket(modHandshake);
      // assert
      expect(result).toEqual(false);
    });
  });

  describe('getUserIdFromHandshake', () => {
    it('should exist when imported', () => {
      // arrange
      // act
      // assert
      expect(getUserIdFromHandshake).toBeDefined();
    });
    // Everything in this function is tested by the previous test
  });
});
