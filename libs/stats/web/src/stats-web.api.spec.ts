import {
  apiStatsWebHealth
} from './stats-web.api';

jest.mock('@dx/rtk-query-web');

describe('apiStatsWebHealth', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(apiStatsWebHealth).toBeDefined();
  });

  it('should should have added specific properties to the main api object when imported', () => {
    // arrange
    // act
    // assert
    expect(apiStatsWebHealth.endpoints.getApiHealthz).toBeDefined();
    expect(apiStatsWebHealth.useLazyGetApiHealthzQuery).toBeDefined();
  });
});
