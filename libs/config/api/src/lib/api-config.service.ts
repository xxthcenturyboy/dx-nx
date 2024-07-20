import {
  API_HOST_PORT,
  API_URL,
  LOCAL_ENV_NAME,
  PROD_ENV_NAME,
  STAGING_ENV_NAME,
  WEB_DOMAIN,
  WEB_URL
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

export function apiPort() {
  if (isLocal()) {
    return Number(API_HOST_PORT.DEV);
  }

  if (isProd()) {
    return Number(API_HOST_PORT.PROD);
  }

  if (isStaging()) {
    return Number(API_HOST_PORT.STAGING);
  }

  return 80;
}

export function apiUrl() {
  if (isLocal()) {
    return API_URL.DEV;
  }

  if (isProd()) {
    return API_URL.PROD;
  }

  if (isStaging()) {
    return API_URL.STAGING;
  }

  return '';
}

export function webUrl() {
  if (isLocal()) {
    return WEB_URL.DEV;
  }

  if (isProd()) {
    return WEB_URL.PROD;
  }

  if (isStaging()) {
    return WEB_URL.STAGING;
  }

  return '';
}

export function webDomain() {
  if (isLocal()) {
    return WEB_DOMAIN.DEV;
  }

  if (isProd()) {
    return WEB_DOMAIN.PROD;
  }

  if (isStaging()) {
    return WEB_DOMAIN.STAGING;
  }

  return '';
}
