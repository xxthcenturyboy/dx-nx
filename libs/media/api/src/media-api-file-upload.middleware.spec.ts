import {
  Request as IRequest,
  Response as IResponse,
  NextFunction
} from 'express';
import { Request } from 'jest-express/lib/request';
import { Response } from 'jest-express/lib/response';
import { next } from 'jest-express/lib/next';
import {
  multiFileUploadMiddleware,
  singleFileUploadMiddleware
} from './media-api-file-upload.middleware';
import { StatusCodes } from 'http-status-codes';

jest.mock('formidable');

describe('multiFileUploadMiddleware', () => {
  let req: IRequest;
  let res: IResponse;
  let nxt: NextFunction;

  beforeEach(() => {
    req = new Request as unknown as IRequest;
    res = new Response as unknown as IResponse;
    nxt = next;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should exist upon import', () => {
    expect(multiFileUploadMiddleware).toBeDefined();
  });

  it('should return an error when no user is present on the request object.', async () => {
    // Arrange
    // Act
    await multiFileUploadMiddleware(req, res, nxt);
    // Assert
    expect(nxt).toHaveBeenCalled();
    expect(req.uploads?.err?.httpCode).toEqual(StatusCodes.FORBIDDEN);
    expect(req.uploads?.err?.message).toEqual('User not allowed.');
  });

  it('should return an error when no form data.', async () => {
    // Arrange
    const request = {
      ...req,
      user: { id: 'test-user-id' }
    } as IRequest;
    // Act
    await multiFileUploadMiddleware(request, res, nxt);
    // Assert
    expect(nxt).toHaveBeenCalled();
    expect(request.uploads?.err?.httpCode).toEqual(StatusCodes.PRECONDITION_FAILED);
    expect(request.uploads?.err?.message).toEqual('No data sent.');
  });

  it('should be successful when has body.', async () => {
    // Arrange
    const request = {
      ...req,
      user: { id: 'test-user-id' },
      body: { fields: ['test'] }
    } as IRequest;
    // Act
    await multiFileUploadMiddleware(request, res, nxt);
    // Assert
    expect(nxt).toHaveBeenCalled();
    expect(request.uploads?.fields).toEqual(['test']);
    expect(request.uploads?.uploadId).toBeDefined();
  });
});

describe('singleFileUploadMiddleware', () => {
  let req: IRequest;
  let res: IResponse;
  let nxt: NextFunction;

  beforeEach(() => {
    req = new Request as unknown as IRequest;
    res = new Response as unknown as IResponse;
    nxt = next;
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should exist upon import', () => {
    expect(singleFileUploadMiddleware).toBeDefined();
  });

  it('should return an error when no user is present on the request object.', async () => {
    // Arrange
    // Act
    await singleFileUploadMiddleware(req, res, nxt);
    // Assert
    expect(nxt).toHaveBeenCalled();
    expect(req.uploads?.err?.httpCode).toEqual(StatusCodes.FORBIDDEN);
    expect(req.uploads?.err?.message).toEqual('User not allowed.');
  });

  it('should return an error when no form data.', async () => {
    // Arrange
    const request = {
      ...req,
      user: { id: 'test-user-id' }
    } as IRequest;
    // Act
    await singleFileUploadMiddleware(request, res, nxt);
    // Assert
    expect(nxt).toHaveBeenCalled();
    expect(request.uploads?.err?.httpCode).toEqual(StatusCodes.PRECONDITION_FAILED);
    expect(request.uploads?.err?.message).toEqual('No data sent.');
  });

  it('should be successful when has body.', async () => {
    // Arrange
    const request = {
      ...req,
      user: { id: 'test-user-id' },
      body: { fields: ['test'] }
    } as IRequest;
    // Act
    await singleFileUploadMiddleware(request, res, nxt);
    // Assert
    expect(nxt).toHaveBeenCalled();
    expect(request.uploads?.fields).toEqual(['test']);
    expect(request.uploads?.uploadId).toBeDefined();
  });
});
