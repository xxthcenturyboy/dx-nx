import { WellKnownSourcesService } from './well-known.dx-mobile.service';
import {
  APPLE_APP_ID,
  APPLE_WEB_CREDENTIALS,
  PACKAGE_NAME,
  SHA256_CERT_FINGERPRINT
} from '@dx/config';

describe('WellKnownSourcesService', () => {
  it('should exist', () => {
    expect(WellKnownSourcesService).toBeDefined();
  });

  describe('getAndroidData', () => {
    it('should exist', () => {
      expect(WellKnownSourcesService.getAndroidData).toBeDefined();
    });

    it('should return data when called', () => {
      // arrange
      // act
      const data = WellKnownSourcesService.getAndroidData();
      // assert
      expect(data).toBeDefined();
      expect(Array.isArray(data)).toBe(true);
      expect(data[0].relation).toEqual(['delegate_permission/common.handle_all_urls']);
      expect(data[0].target.namespace).toEqual('android_app');
      expect(data[0].target.package_name).toEqual(PACKAGE_NAME);
      expect(data[0].target.sha256_cert_fingerprints).toEqual([SHA256_CERT_FINGERPRINT]);
    });
  });

  describe('getAppleData', () => {
    it('should exist', () => {
      expect(WellKnownSourcesService.getAppleData).toBeDefined();
    });

    it('should return data when called', () => {
      // arrange
      // act
      const data = WellKnownSourcesService.getAppleData();
      const appLinkDetails = data.applinks.details;
      const webcredentials = data.webcredentials;
      // assert
      expect(data).toBeDefined();
      expect(Array.isArray(appLinkDetails)).toBe(true);
      expect(appLinkDetails[0].appIDs).toEqual([APPLE_APP_ID]);
      expect(appLinkDetails[0].components).toHaveLength(5);
      expect(webcredentials.apps).toEqual([APPLE_WEB_CREDENTIALS]);
    });
  });
});
