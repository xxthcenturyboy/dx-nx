
import { maliciousUrlCheck } from "./malicious-url-check";
import {
  CLIENT_APP_DOMAIN,
  CLIENT_APP_URL
} from '@dx/config';

describe('maliciousUrlCheck', () => {
  it('should throw on a potentially maliciouls url', () => {
    // arrange
    const urlToCheck = `https://${CLIENT_APP_DOMAIN}.com`;
    // act
    // assert
    try {
      expect(maliciousUrlCheck(urlToCheck)).toThrow();
    } catch (err) {
      expect(err.message).toEqual(`Possible malicious attack - check URL: ${urlToCheck}`);
    }
  });

  it('should run without error on a url that is the main domain', () => {
    // arrange
    // act
    maliciousUrlCheck(CLIENT_APP_URL);
    // assert
    expect(true).toBeTruthy();
  });

  it('should run without error on a benign url', () => {
    // arrange
    const urlToCheck = `${CLIENT_APP_URL}/this-url-should-still-point-to-our-site`;
    // act
    maliciousUrlCheck(urlToCheck);
    // assert
    expect(true).toBeTruthy();
  });

  it('should run without error on a benign url', () => {
    // arrange
    const urlToCheck = `/in-app-route`;
    // act
    maliciousUrlCheck(urlToCheck);
    // assert
    expect(true).toBeTruthy();
  });
});
