import { ShortlinkController } from './shortlink.controller';

describe('ShortlinkController', () => {
  const shortlinkController = new ShortlinkController();

  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(ShortlinkController).toBeDefined();
  });

  it('should exist when instantiated', () => {
    // arrange
    // act
    // assert
    expect(shortlinkController).toBeDefined();
  });

  it('should have getData method when instantiated', () => {
    // arrange
    // act
    // assert
    expect(shortlinkController.getData).toBeDefined();
  });
});
