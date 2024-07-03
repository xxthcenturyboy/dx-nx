import { DevicesResponseType } from '../model/devices.types';
import { DevicesService } from './devices.service';

describe('DevicesService', () => {
  const devicesService = new DevicesService();

  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(DevicesService).toBeDefined();
  });

  it('should exist when instantiated', () => {
    // arrange
    // act
    // assert
    expect(devicesService).toBeDefined();
  });

  describe('handleDevice', () => {
    it('should be the public method handleDevice in the class when instantiated', () => {
      // arrange
      const devicesService = new DevicesService();
      let response: null | DevicesResponseType = null;
      const expectedResult: DevicesResponseType = { message: 'devices' };
      // act
      // assert
      expect(devicesService.handleDevice).toBeDefined();
    });
  });
});
