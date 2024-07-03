import { DEVICES_ENTITY_NAME } from './devices.consts';

describe('DEVICES_ENTITY_NAME ', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(DEVICES_ENTITY_NAME).toBeDefined();
  });

  it('should have correct value', () => {
    // arrange
    // act
    // assert
    expect(DEVICES_ENTITY_NAME).toEqual('devices');
  });
});
