import {
  NOTIFICATION_API_ENTITY_NAME,
  NOTIFICATION_POSTGRES_DB_NAME
} from './notification.consts';

describe('NOTIFICATION_API_ENTITY_NAME ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(NOTIFICATION_API_ENTITY_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(NOTIFICATION_API_ENTITY_NAME).toEqual('notifications');
  });
});

describe('NOTIFICATION_POSTGRES_DB_NAME ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(NOTIFICATION_POSTGRES_DB_NAME).toBeDefined();
  });

  it('should have correct values', () => {
    // arrange
    // act
    // assert
    expect(NOTIFICATION_POSTGRES_DB_NAME).toEqual('notificaitons');
  });
});
