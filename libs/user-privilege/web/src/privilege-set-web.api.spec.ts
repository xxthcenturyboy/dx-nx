import {
  apiWebPrivilegeSets
} from './privilege-set-web.api';

jest.mock('@dx/rtk-query-web');

describe('apiWebPrivilegeSets', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(apiWebPrivilegeSets).toBeDefined();
  });

  it('should should have added specific properties to the main api object when imported', () => {
    // arrange
    // act
    // assert
    expect(apiWebPrivilegeSets.endpoints.getPrivilegeSets).toBeDefined();
    expect(apiWebPrivilegeSets.useLazyGetPrivilegeSetsQuery).toBeDefined();
  });
});
