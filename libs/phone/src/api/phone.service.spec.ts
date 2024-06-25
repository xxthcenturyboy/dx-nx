import { PhoneResponseType } from '../model/phone.types';
import { PhoneService } from './phone.service';

describe('PhoneService', () => {
  const phoneService = new PhoneService();

  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(PhoneService).toBeDefined();
  });

  it('should exist when instantiated', () => {
    // arrange
    // act
    // assert
    expect(phoneService).toBeDefined();
  });

  describe('getData', () => {
    it('should be the public method getData in the class when instantiated', () => {
      // arrange
      const phoneService = new PhoneService();
      let response: null | PhoneResponseType = null;
      const expectedResult: PhoneResponseType = { message: 'phone' };
      // act
      response = phoneService.getData();
      // assert
      expect(phoneService.getData).toBeDefined();
    });

    it('should return the correct response object when called', () => {
      // arrange
      const phoneService = new PhoneService();
      let response: null | PhoneResponseType = null;
      const expectedResult: PhoneResponseType = { message: 'phone' };
      // act
      response = phoneService.getData();
      // assert
      expect(response).toEqual(expectedResult);
    });
  });
});
