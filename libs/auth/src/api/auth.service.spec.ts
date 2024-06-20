import { AuthResponseType } from '../model/auth.types';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  // arrange
  const authService = new AuthService();
  // act
  // assert
  it('should exist when imported', () => {
    expect(AuthService).toBeDefined();
  });

  it('should exist when instantiated', () => {
    expect(authService).toBeDefined();
  });

  describe('getData', () => {
    // arrange
    const authService = new AuthService();
    let response: null | AuthResponseType = null;
    const expectedResult: AuthResponseType = { message: 'auth' };

    // act
    response = authService.getData();

    // assert
    it('should be the public method getData in the class when instantiated', () => {
      expect(authService.getData).toBeDefined();
    });

    it('should return the correct response object when called', () => {
      expect(response).toEqual(expectedResult);
    });
  });
});
