import {
  AndroiodWellKnownData,
  APPLE_APP_ID,
  APPLE_WEB_CREDENTIALS,
  AppleWellKnownData,
  PACKAGE_NAME,
  SHA256_CERT_FINGERPRINT
} from '@dx/config';

export class WellKnownSourcesService {
  public static getAppleData(): AppleWellKnownData {
    return {
      applinks: {
        details: [
          {
            appIDs: [APPLE_APP_ID],
            components: [
              {
                '#': 'no_universal_links',
                exclude: true,
                comment: 'Matches any URL whose fragment equals no_universal_links and instructs the system not to open it as a universal link'
              },
              {
                '/': '/verify',
                comment: 'Matches any URL whose path starts with /verify'
              },
              {
                '/': '/verify/*',
                comment: 'Matches any URL whose path starts with /verify/'
              },
              {
                '/': '/api/confirm-email',
                comment: 'Matches any URL whose path starts with /api/confirm-email'
              },
              {
                '/': '/api/device/verify-token',
                comment: 'Matches any URL whose path starts with /api/device/verify-token'
              }
            ],
          }
        ]
      },
      webcredentials: {
        apps: [APPLE_WEB_CREDENTIALS]
      }
    };
  }

  public static getAndroidData(): AndroiodWellKnownData[] {
    return [{
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: PACKAGE_NAME,
        sha256_cert_fingerprints: [SHA256_CERT_FINGERPRINT]
      }
    }]
  }
}
