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
  S3_APP_BUCKET_NAME,
  UPLOAD_MAX_FILE_SIZE
} from '@dx/config-api';
import { MB, S3_BUCKETS } from '@dx/media-shared';
import { dxGenerateRandomValue } from '@dx/util-encryption';

export async function fileUploadMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.method !== 'POST') {
    req.uploads = {
      err: {
        httpCode: StatusCodes.METHOD_NOT_ALLOWED,
        message: 'Method not allowed.'
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
          Bucket: `${S3_APP_BUCKET_NAME}-${S3_BUCKETS.USER_CONTENT}`,
          Key: `uploads/${uploadId}/${(file as File).originalFilename}`,
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

  const formData = formidable({
    multiples: true,
    maxFileSize: Number(UPLOAD_MAX_FILE_SIZE) * MB,
    fileWriteStreamHandler: fileWriteStreamHandler
  });

  try {
    const uploadResult = await new Promise<{
      fields: Fields<string>,
      files: Files<string>
    }>((resolve, reject) => {
      let formidableError: unknown;

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
        ...uploadResult
      };
    }

    next();
  } catch (err) {
    req.uploads = {
      err: {
        httpCode: err.httpCode ||  StatusCodes.PRECONDITION_FAILED,
        message: (err as Error).message
      }
    }
    next();
  }
}
