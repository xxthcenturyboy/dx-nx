import {
  apiWebPhone
} from './phone-web.api';

jest.mock('@dx/rtk-query-web');

describe('apiWebPhone', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(apiWebPhone).toBeDefined();
  });

  it('should should have added specific properties to the main api object when imported', () => {
    // arrange
    // act
    // assert
    expect(apiWebPhone.endpoints.addPhone).toBeDefined();
    expect(apiWebPhone.useAddPhoneMutation).toBeDefined();

    expect(apiWebPhone.endpoints.checkPhoneAvailability).toBeDefined();
    expect(apiWebPhone.useCheckPhoneAvailabilityMutation).toBeDefined();

    expect(apiWebPhone.endpoints.deletePhone).toBeDefined();
    expect(apiWebPhone.useDeletePhoneMutation).toBeDefined();

    expect(apiWebPhone.endpoints.deletePhoneProfile).toBeDefined();
    expect(apiWebPhone.useDeletePhoneProfileMutation).toBeDefined();

    expect(apiWebPhone.endpoints.updatePhone).toBeDefined();
    expect(apiWebPhone.useUpdatePhoneMutation).toBeDefined();
  });
});
