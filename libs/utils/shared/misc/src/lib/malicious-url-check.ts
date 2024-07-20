import {
  CLIENT_APP_DOMAIN,
  CLIENT_APP_URL
} from '@dx/config-shared';

export function maliciousUrlCheck(urlToCheck: string) {
  const TRANSFORMED_APP_DOMAIN = CLIENT_APP_DOMAIN.replace(/\./g, '\\.');
  // below makes use of query params - not necessary here
  // const PATTERN_APP_DOMAIN = new RegExp(`^${CLIENT_APP_DOMAIN.replace(/\./g, '\\.')}[.:?/]`);
  const TRANSFORMED_APP_URL = CLIENT_APP_URL.replace(/\./g, '\\.');

  const PATTERN_REQUIRES_TEST = new RegExp('^(http|https)://\\S|^//\\S', 'i');
  const PATTERN_APP_URL = new RegExp(`^${TRANSFORMED_APP_URL}`);
  const PATTERN_MAIN_DOMAIN = new RegExp(
    `^(http|https):\/\/${TRANSFORMED_APP_DOMAIN}/`,
    'i'
  );

  // always allow
  if (PATTERN_MAIN_DOMAIN.test(urlToCheck)) return;

  if (urlToCheck && PATTERN_REQUIRES_TEST.test(urlToCheck)) {
    if (!urlToCheck.match(PATTERN_APP_URL)) {
      throw new Error(`Possible malicious attack - check URL: ${urlToCheck}`);
    }
  }
}
