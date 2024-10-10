import {
  apiWebMedia
} from './media-web.api';

jest.mock('@dx/rtk-query-web');

describe('apiWebMedia', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(apiWebMedia).toBeDefined();
  });

  it('should should have added specific properties to the main api object when imported', () => {
    // arrange
    // act
    // assert
    expect(apiWebMedia.endpoints.uploadAvatar).toBeDefined();
    expect(apiWebMedia.useUploadAvatarMutation).toBeDefined();
  });
});
