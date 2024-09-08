import { MediaDataType } from '@dx/media-shared';
import { UploadProgressHandlerType } from '@dx/rtk-query-web';

export type MediaStateType = {
  media: MediaDataType[];
};

export type MediaWebAvatarUploadParamsType = {
  file: Blob;
  fileName: string;
  uploadProgressHandler: UploadProgressHandlerType
};
