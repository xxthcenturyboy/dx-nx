import { HealthzController } from './healthz.controller';

describe('HealthzController', () => {
  // arrange
  const healthzController = new HealthzController();
  // act
  // assert
  it ('should exist when imported', () => {
    expect(HealthzController).toBeDefined();
  });

  it ('should exist when instantiated', () => {
    expect(healthzController).toBeDefined();
  });

  it ('should have getHttpHealthz method when instantiated', () => {
    expect(healthzController.getHttpHealthz).toBeDefined();
  });
});
