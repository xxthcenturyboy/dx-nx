import { Sequelize } from 'sequelize-typescript';

import { PostgresDbConnection } from '@dx/data-access-postgres';
import { ApiLoggingClass } from '@dx/logger-api';
import { ShortLinkModel } from './shortlink.postgres-model';
import { SHORTLINK_POSTGRES_DB_NAME } from './shortlink.consts';
import { isLocal } from '@dx/config-shared';
import { POSTGRES_URI } from '@dx/config-api';

jest.mock('@dx/logger');

describe('ShortlinkModel', () => {
  if (isLocal()) {
    let db: Sequelize;

    beforeAll(async () => {
      new ApiLoggingClass({ appName: 'Unit-Test' });
      const connection = new PostgresDbConnection({
        postgresUri: POSTGRES_URI,
        models: [ShortLinkModel],
      });
      await connection.initialize();
      db = PostgresDbConnection.dbHandle;
    });

    afterAll(async () => {
      await db.close();
    });

    it('should exist when imported', () => {
      // arange
      // act
      // assert
      expect(ShortLinkModel).toBeDefined();
      expect(ShortLinkModel.isInitialized).toBeTruthy();
      expect(ShortLinkModel.name).toEqual(SHORTLINK_POSTGRES_DB_NAME);
      expect(ShortLinkModel.primaryKeyAttribute).toEqual('id');
    });

    it('should have required attributes', () => {
      // arrange
      const attributes = ShortLinkModel.getAttributes();
      // act
      // assert
      expect(attributes.createdAt).toBeDefined();
      expect(attributes.target).toBeDefined();
    });

    it('should have static methods', () => {
      // arrange
      // act
      // assert
      expect(ShortLinkModel.generateShortlink).toBeDefined();
      expect(ShortLinkModel.getShortLinkTarget).toBeDefined();
    });
  } else {
    describe('ShortLinkModel', () => {
      it('should exist when imported', () => {
        // arange
        // act
        // assert
        expect(ShortLinkModel).toBeDefined();
      });
    });
  }
});
