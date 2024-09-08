import { apiWebMain } from '@dx/rtk-query-web';
import {
  MEDIA_SUB_TYPES,
  MediaDataType
} from '@dx/media-shared';
import { MediaWebAvatarUploadParamsType } from './media-web.types';

export const apiWebMedia = apiWebMain.injectEndpoints({
  endpoints: (build) => ({
    uploadAvatar: build.mutation<MediaDataType, MediaWebAvatarUploadParamsType>({
      // @ts-expect-error - types are good - error is wrong
      query: (payload) => {
        const bodyFormData = new FormData();
        bodyFormData.append('file', payload.file, payload.fileName);
        bodyFormData.append('mediaSubType', MEDIA_SUB_TYPES.PROFILE_IMAGE);
        return {
          url: 'v1/media/upload-user-content',
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: bodyFormData,
          uploadProgressHandler: payload.uploadProgressHandler
        }
      }
    })
  }),
  overrideExisting: true
});

export const {
  useUploadAvatarMutation
} = apiWebMedia;
