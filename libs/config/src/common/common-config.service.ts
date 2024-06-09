import { LOCAL_ENV_NAME } from "./common-config.consts";

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
