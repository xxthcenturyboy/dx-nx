import { UserResponseType } from '../model/user.types';
import { UserService } from './user.service';

describe('UserService', () => {
  // arrange
  const userService = new UserService();
  // act
  // assert
  it('should exist when imported', () => {
    expect(UserService).toBeDefined();
  });

  it('should exist when instantiated', () => {
    expect(userService).toBeDefined();
  });

  describe('getData', () => {
    // arrange
    const userService = new UserService();
    let response: null | UserResponseType = null;
    const expectedResult: UserResponseType = { message: 'user' };

    // act
    response = userService.getData();

    // assert
    it('should be the public method getData in the class when instantiated', () => {
      expect(userService.getData).toBeDefined();
    });

    it('should return the correct response object when called', () => {
      expect(response).toEqual(expectedResult);
    });
  });
});
