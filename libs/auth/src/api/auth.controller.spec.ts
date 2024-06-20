import { AuthController } from './auth.controller';

describe('AuthController', () => {
  // arrange
  const authController = new AuthController();
  // act
  // assert
  it('should exist when imported', () => {
    expect(AuthController).toBeDefined();
  });

  it('should exist when instantiated', () => {
    expect(authController).toBeDefined();
  });

  it('should have getData method when instantiated', () => {
    expect(authController.getData).toBeDefined();
  });
});
