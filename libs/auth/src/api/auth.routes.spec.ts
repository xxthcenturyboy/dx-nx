import { AuthRoutes } from './auth.routes';

describe('AuthRoutes', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(AuthRoutes).toBeDefined();
  });

  it('should have static configure method without being instantiated', () => {
    // arrange
    // act
    // assert
    expect(AuthRoutes.configure).toBeDefined();
  });

  it('should get routes when invoked', () => {
    // arrange
    // act
    const routes = AuthRoutes.configure();
    // assert
    expect(routes).toBeDefined();
  });
});
