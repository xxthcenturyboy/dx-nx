type WebAppEnvType = {
  API_PORT: string;
  API_URL: string;
  ENV: string;
  WEB_APP_PORT: string;
  WEB_APP_URL: string;
};

declare const webAppEnvVars: WebAppEnvType;
declare global {
  interface Window {
    WEB_APP_ENV: WebAppEnvType
  }
}

window.WEB_APP_ENV = webAppEnvVars;

export const WEB_APP_ENV: WebAppEnvType = {
  ...webAppEnvVars
};
