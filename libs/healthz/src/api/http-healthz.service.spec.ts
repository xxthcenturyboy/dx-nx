import { HttpHealthzResponseType } from '../model/healthz.types';
import { HttpHealthzService } from './http-healthz.service';

describe('HttpHealthzService', () => {
  // arrange
  const httpHealthzService = new HttpHealthzService();
  // act
  // assert
  it ('should exist when imported', () => {
    expect(HttpHealthzService).toBeDefined();
  });

  it ('should exist when instantiated', () => {
    expect(httpHealthzService).toBeDefined();
  });

  describe('getMessage', () => {
    // arrange
    const httpHealthzService = new HttpHealthzService();
    let httpResponse: null | HttpHealthzResponseType = null;
    const expectedResult: HttpHealthzResponseType = { message: 'Welcome to the api.' }

    // act
    httpResponse = httpHealthzService.getMessage();

    // assert
    it ('should be a public method in the class when instantiated', () => {
      expect(httpHealthzService.getMessage).toBeDefined();
    });
    it('should return the correct response object when called', () => {
      expect(httpResponse).toEqual(expectedResult);
    });
  });
});
