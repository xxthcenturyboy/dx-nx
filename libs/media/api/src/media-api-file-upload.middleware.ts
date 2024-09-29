import {
  NextFunction,
  Request,
  Response
} from 'express';
import { Upload } from '@aws-sdk/lib-storage';
import { StatusCodes } from 'http-status-codes';
import formidable,
{
  Fields,
  File,
  Files
} from 'formidable';
import VolatileFile from 'formidable/VolatileFile';
import internal, { PassThrough } from 'stream';
import dayjs from 'dayjs';

import { S3Service } from '@dx/data-access-s3';
import { ApiLoggingClass } from '@dx/logger-api';
import {
  isDebug,
  isTest,
  S3_APP_BUCKET_NAME,
  UPLOAD_MAX_FILE_SIZE
} from '@dx/config-api';
import { MB, S3_BUCKETS } from '@dx/media-shared';
import { dxGenerateRandomValue } from '@dx/util-encryption';

export async function multiFileUploadMiddleware(req: Request, res: Response, next: NextFunction) {
  if (
    !isDebug()
    && !req.user?.id
  ) {
    req.uploads = {
      err: {
        httpCode: StatusCodes.FORBIDDEN,
        message: 'User not allowed.'
      }
    }
    next();
    return;
  }

  const uploadId = `${dxGenerateRandomValue(8)}-${dayjs().unix()}`;

  function fileWriteStreamHandler(file: VolatileFile | File): internal.Writable {
    try {
      const passThrough = new PassThrough({ allowHalfOpen: false });
      const s3Instance = S3Service.getS3Client();
      const upload = new Upload({
        client: s3Instance,
        params: {
          Bucket: `${S3_APP_BUCKET_NAME}-${S3_BUCKETS.UPLOAD_TMP}`,
          Key: `${uploadId}/${(file as File).originalFilename}`,
          Body: passThrough,
          ContentType: (file as File).mimetype,
          ACL: 'public-read',
        }
      });

      const uploadRequest = upload
        .done()
        .then((response) => {
          (file as File).filepath = response.Location;
        });
      s3Uploads.push(uploadRequest);
      return passThrough;
    } catch (err) {
      ApiLoggingClass.instance.logError(err);
    }
  }

  const s3Uploads: Promise<void>[] = [];

  try {
    const formData = formidable({
      multiples: true,
      maxFileSize: Number(UPLOAD_MAX_FILE_SIZE) * MB,
      maxFiles: 10,
      fileWriteStreamHandler: fileWriteStreamHandler
    });

    const uploadResult = await new Promise<{
      fields: Fields<string>,
      files: Files<string>
    }>((resolve, reject) => {
      let formidableError: unknown;
      if (!formData) {
        if (isTest()) {
          req.body
            ? resolve(req.body)
            : reject('No data sent.')
        }
        reject('formData not defined in formidable.');
      }
      formData.parse(req, (err, fields, files) => {
        if (err) {
          formidableError = err;
        }

        Promise.all(s3Uploads)
          .then(() => {
            if (!formidableError) {
              // @ts-expect-error - types should be ok
              resolve({ ...fields, ...files });
              return;
            }
            reject(formidableError);
          })
          .catch((err) => {
            reject(formidableError || err);
          });
      });
    });

    if (uploadResult) {
      req.uploads = {
        ...uploadResult,
        uploadId: uploadId
      };
    }

    next();
  } catch (err) {
    let message = (err as Error).message || err;
    if (message.includes('maxFiles')) {
      message = '100 File upload count exceeded.'
    }
    if (message.includes('maxTotalFileSize')) {
      message = '101 File size limit exceeded.'
    }

    req.uploads = {
      err: {
        httpCode: err.httpCode ||  StatusCodes.PRECONDITION_FAILED,
        message: message
      },
      uploadId: uploadId
    }
    next();
  }
}

export async function singleFileUploadMiddleware(req: Request, res: Response, next: NextFunction) {
  if (
    !isDebug()
    && !req.user?.id
  ) {
    req.uploads = {
      err: {
        httpCode: StatusCodes.FORBIDDEN,
        message: 'User not allowed.'
      }
    }
    next();
    return;
  }

  const uploadId = `${dxGenerateRandomValue(8)}-${dayjs().unix()}`;

  function fileWriteStreamHandler(file: VolatileFile | File): internal.Writable {
    try {
      const passThrough = new PassThrough({ allowHalfOpen: false });
      const s3Instance = S3Service.getS3Client();
      const upload = new Upload({
        client: s3Instance,
        params: {
          Bucket: `${S3_APP_BUCKET_NAME}-${S3_BUCKETS.UPLOAD_TMP}`,
          Key: `${uploadId}/${(file as File).originalFilename}`,
          Body: passThrough,
          ContentType: (file as File).mimetype,
          ACL: 'public-read',
        }
      });

      const uploadRequest = upload
        .done()
        .then((response) => {
          (file as File).filepath = response.Location;
        });
      s3Uploads.push(uploadRequest);
      return passThrough;
    } catch (err) {
      ApiLoggingClass.instance.logError(err);
    }
  }

  const s3Uploads: Promise<void>[] = [];

  try {
    const formData = formidable({
      multiples: false,
      maxFileSize: Number(UPLOAD_MAX_FILE_SIZE) * MB,
      maxFiles: 1,
      fileWriteStreamHandler: fileWriteStreamHandler
    });

    const uploadResult = await new Promise<{
      fields: Fields<string>,
      files: Files<string>
    }>((resolve, reject) => {
      let formidableError: unknown;
      if (!formData) {
        if (isTest()) {
          req.body
            ? resolve(req.body)
            : reject('No data sent.')
        }
        reject('formData not defined in formidable.');
      }
      formData.parse(req, (err, fields, files) => {
        if (err) {
          formidableError = err;
        }

        Promise.all(s3Uploads)
          .then(() => {
            if (!formidableError) {
              // @ts-expect-error - types should be ok
              resolve({ ...fields, ...files });
              return;
            }
            reject(formidableError);
          })
          .catch((err) => {
            reject(formidableError || err);
          });
      });
    });

    if (uploadResult) {
      req.uploads = {
        ...uploadResult,
        uploadId: uploadId
      };
    }

    next();
  } catch (err) {
    let message = (err as Error).message || err;
    if (message.includes('maxFiles')) {
      message = '100 File upload count exceeded.'
    }
    if (message.includes('maxTotalFileSize')) {
      message = '101 File size limit exceeded.'
    }

    req.uploads = {
      err: {
        httpCode: err.httpCode ||  StatusCodes.PRECONDITION_FAILED,
        message: message
      },
      uploadId: uploadId
    }
    next();
  }
}
