import {
  USER_ROLE,
  USER_ROLE_ARRAY,
  USER_PRIVILEGES_ENTITY_NAME,
  USER_PRIVILEGES_POSTGRES_DB_NAME,
} from './user-privilege.consts';

describe('USER_ROLE ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(USER_ROLE).toBeDefined();
  });

  it('should have correct value', () => {
    expect(USER_ROLE.ADMIN).toEqual('ADMIN');
    expect(USER_ROLE.SUPER_ADMIN).toEqual('SUPER_ADMIN');
    expect(USER_ROLE.USER).toEqual('USER');
  });
});

describe('USER_ROLE_ARRAY ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(USER_ROLE_ARRAY).toBeDefined();
  });

  it('should have correct values', () => {
    expect(USER_ROLE_ARRAY).toHaveLength(3);
  });
});

describe('USER_PRIVILEGES_ENTITY_NAME ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(USER_PRIVILEGES_ENTITY_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    expect(USER_PRIVILEGES_ENTITY_NAME).toEqual('user-privileges');
  });
});

describe('USER_PRIVILEGES_POSTGRES_DB_NAME ', () => {
  // arrange
  // act
  // assert
  it('should exist when imported', () => {
    expect(USER_PRIVILEGES_POSTGRES_DB_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    expect(USER_PRIVILEGES_POSTGRES_DB_NAME).toEqual('user_privileges');
  });
});
