import { APP_NAME } from "../common/common-config.consts";
import { getEnvironment } from "../common/common-config.service";

const env = getEnvironment();

export const API_APP_NAME = `${APP_NAME.toLowerCase()}-api`;

export const POSTGRES_URI = env.POSTGRES_URI || '';
