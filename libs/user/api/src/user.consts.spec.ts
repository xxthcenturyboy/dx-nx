import {
  ACCOUNT_RESTRICTIONS,
  USER_ENTITY_NAME,
  USER_ENTITY_POSTGRES_DB_NAME,
  USER_FIND_ATTRIBUTES,
  USER_SORT_FIELDS
} from './user.consts';

describe('ACCOUNT_RESTRICTIONS ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(ACCOUNT_RESTRICTIONS).toBeDefined();
  });

  it('should have correct value', () => {
    expect(ACCOUNT_RESTRICTIONS.ADMIN_LOCKOUT).toEqual('ADMIN_LOCKOUT');
    expect(ACCOUNT_RESTRICTIONS.LOGIN_ATTEMPTS).toEqual('LOGIN_ATTEMPTS');
    expect(ACCOUNT_RESTRICTIONS.OTP_LOCKOUT).toEqual('OTP_LOCKOUT');
  });
});

describe('USER_ENTITY_NAME ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(USER_ENTITY_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    expect(USER_ENTITY_NAME).toEqual('user');
  });
});

describe('USER_ENTITY_POSTGRES_DB_NAME ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(USER_ENTITY_POSTGRES_DB_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    expect(USER_ENTITY_POSTGRES_DB_NAME).toEqual('user');
  });
});

describe('USER_FIND_ATTRIBUTES ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(USER_FIND_ATTRIBUTES).toBeDefined();
  });

  it('should have correct value', () => {
    expect(USER_FIND_ATTRIBUTES).toEqual([
      'id',
      'firstName',
      'lastName',
      'fullName',
      'isAdmin',
      'isSuperAdmin',
      'optInBeta',
      'roles',
      'username',
      'restrictions',
    ]);
  });
});

describe('USER_SORT_FIELDS ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(USER_SORT_FIELDS).toBeDefined();
  });

  it('should have correct value', () => {
    expect(USER_SORT_FIELDS).toEqual(['firstName', 'lastName', 'optInBeta']);
  });
});
