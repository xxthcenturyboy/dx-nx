import {
  APP_NAME,
  APP_PREFIX
} from '@dx/config-shared';
import { getEnvironment } from './api-config.service';

const __API_ROOT_DIR__ =
  process.env.API_ROOT_DIR || process.env.PWD || process.cwd();

const env = getEnvironment();

export const API_APP_NAME = `${APP_NAME.toLowerCase()}-api`;
export const API_ROOT = __API_ROOT_DIR__;
export const CRYPT_KEY =
  env.CRYPT_KEY ||
  '21011dc57c5bed4efac0101a340665b1e45a87aa0606e534244d203133e6a83e';
export const JWT_SECRET = env.JWT_SECRET || APP_NAME;
export const OTP_SALT = env.OTP_SALT || 'OU812';
export const POSTGRES_URI = env.POSTGRES_URI || '';
export const S3_ACCESS_KEY_ID = env.AWS_S3_ACCESS_KEY_ID || '';
export const S3_APP_BUCKET_NAME = `${APP_PREFIX}-bucket`;
export const S3_SECRET_ACCESS_KEY = env.AWS_S3_SECRET_ACCESS_KEY || '';
export const SENDGRID_API_KEY = env.SENDGRID_API_KEY || 'SG.secret';
export const SENDGRID_URL = env.SENDGRID_URL || 'http://localhost:7000';
export const UPLOAD_MAX_FILE_SIZE = env.UPLOAD_MAX_FILE_SIZE || 50;
