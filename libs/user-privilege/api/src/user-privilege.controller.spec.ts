import { Request as IRequest, Response as IResponse } from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { sendOK, sendBadRequest } from '@dx/utils-api-http-response';
import { PrivilegeSetController } from './user-privilege.controller';

jest.mock('./user-privilege.service.ts');
jest.mock('@dx/utils-api-http-response', () => ({
  sendOK: jest.fn(),
  sendBadRequest: jest.fn(),
}));

describe('PrivilegeSetController', () => {
  let req: IRequest;
  let res: IResponse;

  beforeEach(() => {
    req = new Request() as unknown as IRequest;
    res = new Response() as unknown as IResponse;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(PrivilegeSetController).toBeDefined();
  });

  describe('getAllPrivilegeSets', () => {
    test('should call sendBadRequest when sent without proper mocking of service', async () => {
      // arrange
      // act
      await PrivilegeSetController.getAllPrivilegeSets(req, res);
      // assert
      expect(sendBadRequest).toHaveBeenCalled();
    });
  });

  describe('updatePrivilegeSet', () => {
    test('should call sendBadRequest when sent without proper mocking of service', async () => {
      // arrange
      // act
      await PrivilegeSetController.updatePrivilegeSet(req, res);
      // assert
      expect(sendBadRequest).toHaveBeenCalled();
    });
  });
});
