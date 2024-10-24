import { Router } from 'express';

import {
  ensureLoggedIn,
  ensureLoggedInMedia
} from '@dx/auth-api';
import { MediaApiController } from './media-api.controller';
import { singleFileUploadMiddleware } from './media-api-file-upload.middleware';

export class MediaApiV1Routes {
  static configure() {
    const router = Router();

    router.get('/:id/:size', [ensureLoggedInMedia], MediaApiController.getMedia);

    router.all('/*', [ensureLoggedIn]);

    router.post(
      '/upload-user-content',
      singleFileUploadMiddleware,
      MediaApiController.uploadUserContent
    );

    return router.bind(router);
  }
}

export type MediaApiV1RoutesType = typeof MediaApiV1Routes.prototype;
