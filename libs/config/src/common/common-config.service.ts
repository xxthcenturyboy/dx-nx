import {
  LOCAL_ENV_NAME,
  PROD_ENV_NAME
} from "./common-config.consts";

export function getEnvironment() {
  return {
    ...process.env
  };
}

export function isDebug() {
  const env = getEnvironment();

  if (env.NODE_ENV === 'production') {
    return false;
  }

  if (typeof env.DEBUG !== 'undefined') {
    return typeof env.DEBUG === 'string'
      ? env.DEBUG === 'true'
      : !!env.DEBUG;
  }

  return true;
};

export function isLocal() {
  const env = getEnvironment();
  return env.NODE_ENV === LOCAL_ENV_NAME;
}

export function isProd() {
  const env = getEnvironment();
  return env.NODE_ENV === PROD_ENV_NAME;
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
