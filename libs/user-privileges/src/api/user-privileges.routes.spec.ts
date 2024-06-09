import { UserPrivilegesRoutes } from './user-privileges.routes';

describe('UserPrivilegesRoutes', () => {
  // arrange
  const userprivilegesRoutes = new UserPrivilegesRoutes();
  // act
  // assert
  it('should exist when imported', () => {
    expect(UserPrivilegesRoutes).toBeDefined();
  });

  it('should have static configure method without being instantiated', () => {
    expect(UserPrivilegesRoutes.configure).toBeDefined();
  });

  it('should exist when instantiated', () => {
    expect(userprivilegesRoutes).toBeDefined();
  });

  it('should have getRoutes method when instantiated', () => {
    expect(userprivilegesRoutes.getRoutes).toBeDefined();
  });
});
