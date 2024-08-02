import {
  LOCAL_ENV_NAME,
  PROD_ENV_NAME,
  STAGING_ENV_NAME
} from '@dx/config-shared';

export function getEnvironment() {
  return {
    ...process.env,
  };
}

export function isDebug() {
  const env = getEnvironment();

  if (env.NODE_ENV === 'production') {
    return false;
  }

  if (typeof env.DEBUG !== 'undefined') {
    return typeof env.DEBUG === 'string' ? env.DEBUG === 'true' : !!env.DEBUG;
  }

  return true;
}

export function isLocal() {
  const env = getEnvironment();
  return env.NODE_ENV === LOCAL_ENV_NAME;
}

export function isProd() {
  const env = getEnvironment();
  return env.NODE_ENV === PROD_ENV_NAME;
}

export function isStaging() {
  const env = getEnvironment();
  return env.NODE_ENV === STAGING_ENV_NAME;
}

export function isTest() {
  const env = getEnvironment();
  if (typeof env.IS_TEST !== 'undefined') {
    return typeof env.IS_TEST === 'string'
      ? env.IS_TEST === 'true'
      : !!env.IS_TEST;
  }

  return false;
}

export function webDomain() {
  const ENV = getEnvironment();
  if (ENV) {
    return ENV.WEB_APP_URL;
  }

  return '';
}

export function webUrl() {
  const ENV = getEnvironment();
  if (ENV) {
    let url = ENV.WEB_APP_URL;
    if (ENV.WEB_APP_PORT.toString() !== '80') {
      url = url + ':' + ENV.WEB_APP_PORT;
    }
    return url;
  }

  return '';
}
