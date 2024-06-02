import { HealthzRoutes } from './healthz.routes';

describe('HealthzRoutes', () => {
  // arrange
  const healthzRoutes = new HealthzRoutes();
  // act
  // assert
  it ('should exist when imported', () => {
    expect(HealthzRoutes).toBeDefined();
  });

  it ('should have static configure method without being instantiated', () => {
    expect(HealthzRoutes.configure).toBeDefined();
  });

  it ('should exist when instantiated', () => {
    expect(healthzRoutes).toBeDefined();
  });

  it ('should have getRoutes method when instantiated', () => {
    expect(healthzRoutes.getRoutes).toBeDefined();
  });
});
