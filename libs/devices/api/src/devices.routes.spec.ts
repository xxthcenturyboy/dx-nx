import { DevicesRoutes } from './devices.routes';

jest.mock('@dx/api-http-response');

describe('DevicesRoutes', () => {
  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(DevicesRoutes).toBeDefined();
  });

  it('should have static configure method without being instantiated', () => {
    // arrange
    // act
    // assert
    expect(DevicesRoutes.configure).toBeDefined();
  });

  it('should get routes when invoked', () => {
    // arrange
    // act
    const routes = DevicesRoutes.configure();
    // assert
    expect(routes).toBeDefined();
  });
});
