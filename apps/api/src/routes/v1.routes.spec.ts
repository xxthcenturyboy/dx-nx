import { Express as IExpress} from 'express';
import { Express } from 'jest-express/lib/express';
import { RoutesV1 } from './v1.routes';

let app: IExpress;

describe('RoutesV1', () => {
  beforeEach(() => {
    app = new Express() as unknown as IExpress;
  });

  // @ts-expect-error - type error
  afterEach(() => app.resetMocked());

  it('should exist when imported', () => {
    expect(RoutesV1).toBeDefined();
  });

  it('should have required methods and properties when instantiated', () => {
    // arrange
    const routes = new RoutesV1(app);
    // act
    // assert
    expect(routes.loadRoutes).toBeDefined();
    expect(routes.app).toBeDefined();
    expect(routes.healthzRoutes).toBeDefined();
    expect(routes.userRoutes).toBeDefined();
  });

  it('should load routes when invoked', () => {
    // arrange
    const routes = new RoutesV1(app);
    // act
    routes.loadRoutes();
    // assert
    expect(app.use).toHaveBeenCalledTimes(3);
  });
});
