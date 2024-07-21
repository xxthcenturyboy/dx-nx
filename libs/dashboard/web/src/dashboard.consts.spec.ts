import {
  DASHBOARD_ENTITY_NAME
} from './dashboard.consts';

describe('HOME_ENTITY_NAME ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(DASHBOARD_ENTITY_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(DASHBOARD_ENTITY_NAME).toEqual('dashboard');
  });
});
