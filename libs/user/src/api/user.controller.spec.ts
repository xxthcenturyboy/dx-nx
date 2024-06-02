import { UserController } from './user.controller';

describe('UserController', () => {
  // arrange
  const userController = new UserController();
  // act
  // assert
  it('should exist when imported', () => {
    expect(UserController).toBeDefined();
  });

  it('should exist when instantiated', () => {
    expect(userController).toBeDefined();
  });

  it('should have getData method when instantiated', () => {
    expect(userController.getData).toBeDefined();
  });
});
