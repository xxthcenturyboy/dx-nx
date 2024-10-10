import {
  apiWebUserProfile
} from './user-profile-web.api';

jest.mock('@dx/rtk-query-web');

describe('apiWebUserProfile', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(apiWebUserProfile).toBeDefined();
  });

  it('should should have added specific properties to the main api object when imported', () => {
    // arrange
    // act
    // assert
    expect(apiWebUserProfile.endpoints.getProfile).toBeDefined();
    expect(apiWebUserProfile.useLazyGetProfileQuery).toBeDefined();

    expect(apiWebUserProfile.endpoints.updatePassword).toBeDefined();
    expect(apiWebUserProfile.useUpdatePasswordMutation).toBeDefined();
  });
});
