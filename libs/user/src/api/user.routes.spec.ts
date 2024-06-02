import { UserRoutes } from './user.routes';

describe('UserRoutes', () => {
  // arrange
  const userRoutes = new UserRoutes();
  // act
  // assert
  it('should exist when imported', () => {
    expect(UserRoutes).toBeDefined();
  });

  it('should have static configure method without being instantiated', () => {
    expect(UserRoutes.configure).toBeDefined();
  });

  it('should exist when instantiated', () => {
    expect(userRoutes).toBeDefined();
  });

  it('should have getRoutes method when instantiated', () => {
    expect(userRoutes.getRoutes).toBeDefined();
  });
});
