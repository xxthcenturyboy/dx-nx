import { APP_NAME } from "../common/common-config.consts";
import { getEnvironment } from "../common/common-config.service";

const env = getEnvironment();

export const API_APP_NAME = `${APP_NAME.toLowerCase()}-api`;
export const APP_PREFIX = 'dx';
export const CRYPT_KEY = env.CRYPT_KEY || '21011dc57c5bed4efac0101a340665b1e45a87aa0606e534244d203133e6a83e';
export const POSTGRES_URI = env.POSTGRES_URI || '';
