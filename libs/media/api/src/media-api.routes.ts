import { Router } from 'express';

import {
  ensureLoggedIn
} from '@dx/auth-api';
import { MediaApiController } from './media-api.controller';
import { fileUploadMiddleware } from './media-api-file-upload.middleware';

export class MediaApiV1Routes {
  static configure() {
    const router = Router();

    router.post(
      '/upload',
      // [
      //   ensureLoggedIn
      // ],
      fileUploadMiddleware,
      MediaApiController.uploadFile
    );

    return router.bind(router);
  }
}

export type MediaApiV1RoutesType = typeof MediaApiV1Routes.prototype;
