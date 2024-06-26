
import { malicousUrlCheck } from "./malicious-url-check";
import {
  CLIENT_APP_DOMAIN,
  CLIENT_APP_URL
} from '@dx/config';

describe('malicousUrlCheck', () => {
  it('should throw on a potentially maliciouls url', () => {
    // arrange
    const urlToCheck = `https://${CLIENT_APP_DOMAIN}.com`;
    // act
    // assert
    try {
      expect(malicousUrlCheck(urlToCheck)).toThrow();
    } catch (err) {
      expect(err.message).toEqual(`Possible malicious attack - check URL: ${urlToCheck}`);
    }
  });

  it('should run without error on a url that is the main domain', () => {
    // arrange
    // act
    malicousUrlCheck(CLIENT_APP_URL);
    // assert
    expect(true).toBeTruthy();
  });

  it('should run without error on a benign url', () => {
    // arrange
    const urlToCheck = `${CLIENT_APP_URL}/this-url-should-still-point-to-our-site`;
    // act
    malicousUrlCheck(urlToCheck);
    // assert
    expect(true).toBeTruthy();
  });

  it('should run without error on a benign url', () => {
    // arrange
    const urlToCheck = `/in-app-route`;
    // act
    malicousUrlCheck(urlToCheck);
    // assert
    expect(true).toBeTruthy();
  });
});
