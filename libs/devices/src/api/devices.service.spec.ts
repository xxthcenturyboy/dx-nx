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

  describe('getData', () => {
    it('should be the public method getData in the class when instantiated', () => {
      // arrange
      const devicesService = new DevicesService();
      let response: null | DevicesResponseType = null;
      const expectedResult: DevicesResponseType = { message: 'devices' };
      // act
      response = devicesService.getData();
      // assert
      expect(devicesService.getData).toBeDefined();
    });

    it('should return the correct response object when called', () => {
      // arrange
      const devicesService = new DevicesService();
      let response: null | DevicesResponseType = null;
      const expectedResult: DevicesResponseType = { message: 'devices' };
      // act
      response = devicesService.getData();
      // assert
      expect(response).toEqual(expectedResult);
    });
  });
});
