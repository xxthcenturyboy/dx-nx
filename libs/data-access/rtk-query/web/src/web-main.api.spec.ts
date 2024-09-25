import {
  apiWebMain
} from './web-main.api';

jest.mock('@dx/rtk-query-web');

describe('web-main.api', () => {
  describe('apiWebMain', () => {
    it('should exist when imported', () => {
      // Arrange
      // Act
      // console.log(apiWebMain);
      // Assert
      expect(apiWebMain).toBeDefined();
    });
  });
});
