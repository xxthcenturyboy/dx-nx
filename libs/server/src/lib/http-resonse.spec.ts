import { ApiLoggingClass } from '@dx/logger';
import { HttpResponse } from './http-response';

describe('HttpResponse', () => {
  beforeAll(() => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
  });

  it('should be defined', () => {
    expect(HttpResponse).toBeDefined();
  });

  it('should have a logger after instantiation', () => {
    // arrange
    const res = new HttpResponse();
    // act
    // assert
    expect(res.logger).toBeDefined();
  })
});
