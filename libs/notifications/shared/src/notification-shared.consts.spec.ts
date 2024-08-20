import {
  NOTIFICATION_ERRORS,
  NOTIFICATION_LEVELS
} from './notification-shared.consts';

describe('NOTIFICATION_ERRORS ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(NOTIFICATION_ERRORS).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(NOTIFICATION_ERRORS.MISSING_PARAMS).toEqual('[NOTIFY] Missing Required Params.');
    expect(NOTIFICATION_ERRORS.MISSING_USER_ID).toEqual('[NOTIFY] User ID required to fetch Notifications by User ID.');
    expect(NOTIFICATION_ERRORS.SERVER_ERROR).toEqual('[NOTIFY] Server error in Notifications');
  });
});

describe('NOTIFICATION_LEVELS ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(NOTIFICATION_LEVELS).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(NOTIFICATION_LEVELS.DANGER).toEqual('DANGER');
    expect(NOTIFICATION_LEVELS.INFO).toEqual('INFO');
    expect(NOTIFICATION_LEVELS.PRIMARY).toEqual('PRIMARY');
    expect(NOTIFICATION_LEVELS.SUCCESS).toEqual('SUCCESS');
    expect(NOTIFICATION_LEVELS.WARNING).toEqual('WARNING');
  });
});
