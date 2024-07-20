import {
  webDomain,
  webUrl
} from '@dx/config-api';
import { maliciousUrlCheck } from './malicious-url-check';

describe('maliciousUrlCheck', () => {
  it('should throw on a potentially maliciouls url', () => {
    // arrange
    const urlToCheck = `https://${webDomain()}.com`;
    // act
    // assert
    try {
      expect(maliciousUrlCheck(webDomain(), webUrl(), urlToCheck)).toThrow();
    } catch (err) {
      expect(err.message).toEqual(
        `Possible malicious attack - check URL: ${urlToCheck}`
      );
    }
  });

  it('should run without error on a url that is the main domain', () => {
    // arrange
    // act
    maliciousUrlCheck(webDomain(), webUrl(), webUrl());
    // assert
    expect(true).toBeTruthy();
  });

  it('should run without error on a benign url', () => {
    // arrange
    const urlToCheck = `${webUrl()}/this-url-should-still-point-to-our-site`;
    // act
    maliciousUrlCheck(webDomain(), webUrl(), urlToCheck);
    // assert
    expect(true).toBeTruthy();
  });

  it('should run without error on a benign url', () => {
    // arrange
    const urlToCheck = `/in-app-route`;
    // act
    maliciousUrlCheck(webDomain(), webUrl(), urlToCheck);
    // assert
    expect(true).toBeTruthy();
  });
});
