import { UserPrivilegesResponseType } from '../model/user-privileges.types';
import { UserPrivilegesService } from './user-privileges.service';

describe('UserPrivilegesService', () => {
  // arrange
  const userprivilegesService = new UserPrivilegesService();
  // act
  // assert
  it('should exist when imported', () => {
    expect(UserPrivilegesService).toBeDefined();
  });

  it('should exist when instantiated', () => {
    expect(userprivilegesService).toBeDefined();
  });

  describe('getData', () => {
    // arrange
    const userprivilegesService = new UserPrivilegesService();
    let response: null | UserPrivilegesResponseType = null;
    const expectedResult: UserPrivilegesResponseType = {
      message: 'user-privileges',
    };

    // act
    response = userprivilegesService.getData();

    // assert
    it('should be the public method getData in the class when instantiated', () => {
      expect(userprivilegesService.getData).toBeDefined();
    });

    it('should return the correct response object when called', () => {
      expect(response).toEqual(expectedResult);
    });
  });
});
