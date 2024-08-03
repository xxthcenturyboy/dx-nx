import { Request as IRequest } from 'express';
import { Request } from 'jest-express/lib/request';

import { HeaderService } from './header.service';

describe('HeaderService', () => {
  it('should exist when imported', () => {
    expect(HeaderService).toBeDefined();
  });

  describe('getTokenFromAuthHeader', () => {
    it('should exist on the class as a static method.', () => {
      expect(HeaderService.getTokenFromAuthHeader).toBeDefined();
    });

    it('should return the token when called.', () => {
      // arrange
      const req: IRequest = new Request() as unknown as IRequest;
      req.headers = {
        authorization: 'Bearer token'
      };
      // act
      const token = HeaderService.getTokenFromAuthHeader(req);
      // assert
      expect(token).toBeDefined();
      expect(token).toEqual('token');
    });
  });
});