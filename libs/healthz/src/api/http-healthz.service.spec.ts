import { STATUS_OK } from '../model/healthz.const';
import {
  HttpHealthzService,
  HttpHealthzServiceType
} from './http-healthz.service';

describe('HttpHealthzService', () => {
  let httpHealthzService: HttpHealthzServiceType;

  beforeEach(() => {
    httpHealthzService = new HttpHealthzService();
  });

  it ('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(HttpHealthzService).toBeDefined();
  });

  it ('should exist when instantiated', () => {
    // arrange
    // act
    // assert
    expect(httpHealthzService).toBeDefined();
  });

  test('should return the correct response when invoked', async () => {
    // arrange
    let httpResponse: string | number = '';
    const expectedResult = STATUS_OK;

    // act
    httpResponse = await httpHealthzService.healthCheck();

    // assert
    expect(httpHealthzService.healthCheck).toBeDefined();
    expect(httpResponse).toEqual(expectedResult);
  });
});
