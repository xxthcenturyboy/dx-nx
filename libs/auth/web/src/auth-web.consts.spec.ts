import {
  AUTH_ENTITY_NAME,
  AUTH_ROUTES
} from './auth-web.consts';

describe('AUTH_ENTITY_NAME ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(AUTH_ENTITY_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(AUTH_ENTITY_NAME).toEqual('auth');
  });
});

describe('AUTH_ROUTES ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(AUTH_ROUTES).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(AUTH_ROUTES.CONFIRM).toEqual(`${AUTH_ENTITY_NAME}/confirm`);
    expect(AUTH_ROUTES.EMAIL_VALIDATED).toEqual(`${AUTH_ENTITY_NAME}/email-validated`);
    expect(AUTH_ROUTES.MAIN).toEqual(`${AUTH_ENTITY_NAME}/main`);
    expect(AUTH_ROUTES.SETUP).toEqual(`${AUTH_ENTITY_NAME}/setup`);
    expect(AUTH_ROUTES.Z).toEqual(`${AUTH_ENTITY_NAME}/z`);
  });
});
