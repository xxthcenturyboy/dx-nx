import { getEnvironment } from "../common/common-config.service";

const env = getEnvironment();

export const CLIENT_APP_DOMAIN = env.CLIENT_HOST || 'http://localhost';
export const CLIENT_APP_URL = `${CLIENT_APP_DOMAIN}:${env.CLIENT_PORT || 3000}`;
