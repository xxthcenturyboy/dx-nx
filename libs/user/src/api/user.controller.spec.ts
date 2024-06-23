import { UserController } from './user.controller';

describe('UserController', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(UserController).toBeDefined();
  });

  it('should have getUser method when instantiated', () => {
    // arrange
    // act
    // assert
    expect(UserController.getUser).toBeDefined();
  });
});
