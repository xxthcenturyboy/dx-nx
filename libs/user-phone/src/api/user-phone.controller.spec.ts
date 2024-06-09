import { UserPhoneController } from './user-phone.controller';

describe('UserPhoneController', () => {
  // arrange
  const userphoneController = new UserPhoneController();
  // act
  // assert
  it('should exist when imported', () => {
    expect(UserPhoneController).toBeDefined();
  });

  it('should exist when instantiated', () => {
    expect(userphoneController).toBeDefined();
  });

  it('should have getData method when instantiated', () => {
    expect(userphoneController.getData).toBeDefined();
  });
});
