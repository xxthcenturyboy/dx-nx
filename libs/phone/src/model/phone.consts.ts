import { IncludeOptions } from 'sequelize/types';

export const PHONE_ENTITY_NAME = 'phone';
export const PHONE_POSTGRES_DB_NAME = 'phone';
export const PHONE_MODEL_OPTIONS: IncludeOptions = {
  association: 'phones',
  attributes: ['id', 'countryCode', 'default', 'isVerified', 'label', 'phone', 'phoneFormatted', 'verifiedAt', 'deletedAt'],
  where: {
    deletedAt: null
  }
};
export const PHONE_DEFAULT_REGION_CODE = 'US';
