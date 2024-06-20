import { AuthRoutes } from './auth.routes';

describe('AuthRoutes', () => {
  // arrange
  const authRoutes = new AuthRoutes();
  // act
  // assert
  it('should exist when imported', () => {
    expect(AuthRoutes).toBeDefined();
  });

  it('should have static configure method without being instantiated', () => {
    expect(AuthRoutes.configure).toBeDefined();
  });

  it('should exist when instantiated', () => {
    expect(authRoutes).toBeDefined();
  });

  it('should have getRoutes method when instantiated', () => {
    expect(authRoutes.getRoutes).toBeDefined();
  });
});
