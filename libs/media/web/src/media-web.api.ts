import { apiWebMain } from '@dx/rtk-query-web';
import {
  MEDIA_SUB_TYPES,
  MediaDataType
} from '@dx/media-shared';

export const apiWebMedia = apiWebMain.injectEndpoints({
  endpoints: (build) => ({
    uploadAvatar: build.mutation<MediaDataType, Blob>({
      // @ts-expect-error - types are good - error is wrong
      query: (paylaod) => {
        const bodyFormData = new FormData();
        bodyFormData.append('file', paylaod);
        bodyFormData.append('mediaSubType', MEDIA_SUB_TYPES.PROFILE_IMAGE);
        return {
          url: 'v1/media/upload-user-content',
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data;'
          },
          data: bodyFormData,
          formData: true
        }
      }
    })
  }),
  overrideExisting: true
});

export const {
  useUploadAvatarMutation
} = apiWebMedia;
