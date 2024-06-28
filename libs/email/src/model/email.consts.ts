import { IncludeOptions } from 'sequelize/types';

export const EMAIL_ENTITY_NAME = 'email';
export const EMAIL_POSTGRES_DB_NAME = 'email';
export const EMAIL_LABEL = {
  DEFAULT: 'Default',
  MAIN: 'Main'
};

export const EMAIL_MODEL_OPTIONS: IncludeOptions = {
  association: 'emails',
  attributes: ['id', 'default', 'isVerified', 'label', 'email', 'verifiedAt', 'deletedAt'],
  where: {
    deletedAt: null
  }
};
