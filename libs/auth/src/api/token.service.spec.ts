import {
  Request as IRequest,
  Response as IResponse
} from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';

import { ApiLoggingClass } from '@dx/logger';
import {
  TokenService,
  TokenServiceType
} from './token.service';

jest.mock('@dx/logger');
jest.mock('./token.cache');

describe('TokenService', () => {
  let tokenService: TokenServiceType;
  let req: IRequest;
  let res: IResponse;

  const logErrorSpy = jest.spyOn(ApiLoggingClass.prototype, 'logError');
  const issueAllSpy = jest.spyOn(TokenService.prototype, 'issueAll');
  // @ts-expect-error - spying on private method
  const getTokenOptionsSpy = jest.spyOn(TokenService.prototype, 'getTokenOptions');
  // @ts-expect-error - spying on private method
  const getRefreshHistorySpy = jest.spyOn(TokenService.prototype, 'getRefreshHistory');
  // @ts-expect-error - spying on private method
  const addRefreshToHistorySpy = jest.spyOn(TokenService.prototype, 'addRefreshToHistory');
  // @ts-expect-error - spying on private method
  const consumeRefreshTokenSpy = jest.spyOn(TokenService.prototype, 'consumeRefreshToken');
  // @ts-expect-error - spying on private method
  const createTokenSpy = jest.spyOn(TokenService.prototype, 'createToken');
  // @ts-expect-error - spying on private method
  const createRefreshTokenSpy = jest.spyOn(TokenService.prototype, 'createRefreshToken');
  // @ts-expect-error - spying on private method
  const isPayloadValidSpy = jest.spyOn(TokenService.prototype, 'isPayloadValid');
  // @ts-expect-error - spying on private method
  const verifyTokenSpy = jest.spyOn(TokenService.prototype, 'verifyToken');

  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
  });

  beforeEach(() => {
    req = new Request() as unknown as IRequest;
    req.session = {
      userId: 'test-user-id'
    };
    res = new Response() as unknown as IResponse;
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should exist', () => {
    expect(TokenService).toBeDefined();
  });

  test('should issue all tokens when issueAll is invoked', async () => {
    // arrange
    tokenService = new TokenService(req, res);
    // act
    const result = await tokenService.issueAll(true);
    // assert
    expect(result).toBeTruthy();
    expect(createTokenSpy).toHaveBeenCalled();
    expect(createRefreshTokenSpy).toHaveBeenCalled();
    expect(addRefreshToHistorySpy).toHaveBeenCalled();
    expect(getTokenOptionsSpy).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledTimes(2);
  });

  test('should reissue all tokens from a refresh token when invoked', async () => {
    // arrange
    tokenService = new TokenService(req, res);
    // act
    await tokenService.issueAll(true);
    // @ts-expect-error - ok
    const refreshToken = Object.keys(tokenService.refreshHistory)[0];
    const result = await tokenService.reissueFromRefresh(refreshToken, true);
    // assert
    expect(result).toBeTruthy();
    expect(consumeRefreshTokenSpy).toHaveBeenCalled();
    expect(issueAllSpy).toHaveBeenCalled();
    expect(addRefreshToHistorySpy).toHaveBeenCalled();
    expect(createTokenSpy).toHaveBeenCalledTimes(2);
    expect(createRefreshTokenSpy).toHaveBeenCalledTimes(2);
    expect(getTokenOptionsSpy).toHaveBeenCalledTimes(2);
    expect(res.cookie).toHaveBeenCalledTimes(4);
  });

  test('should invalidate all tokens when invoked', () => {
    // arrange
    tokenService = new TokenService(req, res);
    // act
    const result = tokenService.invalidateTokens(res);
    // assert
    expect(result).toBeTruthy();
    expect(res.cookie).toHaveBeenCalledTimes(3);
  });

  test('should validate whether a refresh token has been used when invoked', async () => {
    // arrange
    tokenService = new TokenService(req, res);
    // act
    await tokenService.issueAll(true);
    // @ts-expect-error - ok
    const refreshToken = Object.keys(tokenService.refreshHistory)[0];
    const result = await tokenService.hasRefreshBeenUsed(refreshToken);
    // assert
    expect(result).toBeTruthy();
    expect(getRefreshHistorySpy).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledTimes(2);
  });

  test('should validate a token when invoked', async () => {
    // arrange
    tokenService = new TokenService(req, res);
    // act
    await tokenService.issueAll(true);
    const result = tokenService.validateToken();
    // assert
    expect(result).toBeTruthy();
    expect(verifyTokenSpy).toHaveBeenCalledTimes(1);
    expect(isPayloadValidSpy).toHaveBeenCalledTimes(1);
    expect(res.cookie).toHaveBeenCalledTimes(2);
    expect(createTokenSpy).toHaveBeenCalledTimes(1);
    expect(getTokenOptionsSpy).toHaveBeenCalledTimes(1);
  });
});
