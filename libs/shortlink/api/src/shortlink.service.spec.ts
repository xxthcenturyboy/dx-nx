import { Sequelize } from 'sequelize-typescript';

import { ApiLoggingClass } from '@dx/logger-api';
import { PostgresDbConnection } from '@dx/data-access-postgres';
import {
  isLocal,
  POSTGRES_URI
} from '@dx/config-api';
import { ShortLinkModel } from './shortlink.postgres-model';
import { ShortlinkService, ShortlinkServiceType } from './shortlink.service';

jest.mock('@dx/logger-api');

describe('ShortlinkService', () => {
  if (isLocal()) {
    let shortlinkService: ShortlinkServiceType;
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

    beforeEach(() => {
      shortlinkService = new ShortlinkService();
    });

    afterAll(async () => {
      jest.clearAllMocks();
      await db.close();
    });

    it('should exist when imported', () => {
      // arrange
      // act
      // assert
      expect(ShortlinkService).toBeDefined();
    });

    it('should exist when instantiated', () => {
      // arrange
      // act
      // assert
      expect(shortlinkService).toBeDefined();
    });

    describe('getShortlinkTarget', () => {
      it('should exist', () => {
        expect(shortlinkService.getShortlinkTarget).toBeDefined();
      });

      test('should return null when id does not exist', async () => {
        // arrange
        // act
        const result = await shortlinkService.getShortlinkTarget('bad-link-id');
        // assert
        expect(result).toBeNull();
      });
    });
  } else {
    it('should exist when imported', () => {
      // arrange
      // act
      // assert
      expect(ShortlinkService).toBeDefined();
    });

    it('should exist when instantiated', () => {
      // arrange
      // act
      const shortlinkService = new ShortlinkService();
      // assert
      expect(shortlinkService).toBeDefined();
    });

    it('should have all methods', () => {
      // arrange
      // act
      const service = new ShortlinkService();
      // assert
      expect(service.getShortlinkTarget).toBeDefined();
    });
  }
});
