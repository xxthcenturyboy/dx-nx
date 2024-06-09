import { UserPhoneRoutes } from './user-phone.routes';

describe('UserPhoneRoutes', () => {
  // arrange
  const userphoneRoutes = new UserPhoneRoutes();
  // act
  // assert
  it('should exist when imported', () => {
    expect(UserPhoneRoutes).toBeDefined();
  });

  it('should have static configure method without being instantiated', () => {
    expect(UserPhoneRoutes.configure).toBeDefined();
  });

  it('should exist when instantiated', () => {
    expect(userphoneRoutes).toBeDefined();
  });

  it('should have getRoutes method when instantiated', () => {
    expect(userphoneRoutes.getRoutes).toBeDefined();
  });
});
