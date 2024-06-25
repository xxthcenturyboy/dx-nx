import { ShortlinkResponseType } from '../model/shortlink.types';
import { ShortlinkService } from './shortlink.service';

describe('ShortlinkService', () => {
  // arrange
  const shortlinkService = new ShortlinkService();
  // act
  // assert
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(ShortlinkService).toBeDefined();
  });

  it('should exist when instantiated', () => {
    // arrange
    // act
    // assert
    expect(shortlinkService).toBeDefined();
  });

  describe('getData', () => {
    it('should be the public method getData in the class when instantiated', () => {
      // arrange
      const shortlinkService = new ShortlinkService();
      let response: null | ShortlinkResponseType = null;
      const expectedResult: ShortlinkResponseType = { message: 'shortlink' };
      // act
      response = shortlinkService.getData();
      // assert
      expect(shortlinkService.getData).toBeDefined();
    });

    it('should return the correct response object when called', () => {
      // arrange
      const shortlinkService = new ShortlinkService();
      let response: null | ShortlinkResponseType = null;
      const expectedResult: ShortlinkResponseType = { message: 'shortlink' };
      // act
      response = shortlinkService.getData();
      // assert
      expect(response).toEqual(expectedResult);
    });
  });
});
