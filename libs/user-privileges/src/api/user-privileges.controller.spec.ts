import { UserPrivilegesController } from './user-privileges.controller';

describe('UserPrivilegesController', () => {
  // arrange
  const userprivilegesController = new UserPrivilegesController();
  // act
  // assert
  it('should exist when imported', () => {
    expect(UserPrivilegesController).toBeDefined();
  });

  it('should exist when instantiated', () => {
    expect(userprivilegesController).toBeDefined();
  });

  it('should have getData method when instantiated', () => {
    expect(userprivilegesController.getData).toBeDefined();
  });
});
