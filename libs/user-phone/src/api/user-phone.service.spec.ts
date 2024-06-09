import { UserPhoneResponseType } from '../model/user-phone.types';
import { UserPhoneService } from './user-phone.service';

describe('UserPhoneService', () => {
  // arrange
  const userphoneService = new UserPhoneService();
  // act
  // assert
  it('should exist when imported', () => {
    expect(UserPhoneService).toBeDefined();
  });

  it('should exist when instantiated', () => {
    expect(userphoneService).toBeDefined();
  });

  describe('getData', () => {
    // arrange
    const userphoneService = new UserPhoneService();
    let response: null | UserPhoneResponseType = null;
    const expectedResult: UserPhoneResponseType = { message: 'user-phone' };

    // act
    response = userphoneService.getData();

    // assert
    it('should be the public method getData in the class when instantiated', () => {
      expect(userphoneService.getData).toBeDefined();
    });

    it('should return the correct response object when called', () => {
      expect(response).toEqual(expectedResult);
    });
  });
});
