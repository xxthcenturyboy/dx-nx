import { Sequelize } from 'sequelize-typescript';

import { ApiLoggingClass } from '@dx/logger-api';
import { PostgresDbConnection } from '@dx/data-access-postgres';
import { PhoneModel } from '@dx/phone-api';
import { DeviceModel } from '@dx/devices-api';
import { EmailModel } from '@dx/email-api';
import { ShortLinkModel } from '@dx/shortlink-api';
import { UserModel } from '@dx/user-api';
import { isLocal } from '@dx/config-shared';
import { RedisService } from '@dx/data-access-redis';
import { getRedisConfig, POSTGRES_URI } from '@dx/config-api';
import {
  UserPrivilegeService,
  UserPrivilegeServiceType,
} from './user-privilege.service';
import { UpdatePrivilegeSetPayloadType } from './user-privilege.types';
import { UserPrivilegeSetModel } from './user-privilege.postgres-model';
import { USER_ROLE } from './user-privilege.consts';

jest.mock('@dx/logger-api');

describe('UserPrivilegeSetCache', () => {
  if (isLocal()) {
    let db: Sequelize;
    let service: UserPrivilegeServiceType;
    let idToUpdate: string;
    let initialDescription: string;

    beforeAll(async () => {
      new ApiLoggingClass({ appName: 'Unit-Test' });
      const connection = new PostgresDbConnection({
        postgresUri: POSTGRES_URI,
        models: [
          DeviceModel,
          EmailModel,
          PhoneModel,
          ShortLinkModel,
          UserPrivilegeSetModel,
          UserModel,
        ],
      });
      await connection.initialize();
      db = PostgresDbConnection.dbHandle;
      const redisConfig = getRedisConfig();
      new RedisService({
        isLocal: true,
        isTest: true,
        redis: redisConfig,
      });
    });

    beforeEach(() => {
      service = new UserPrivilegeService();
    });

    afterAll(async () => {
      jest.clearAllMocks();
      await db.close();
    });

    it('should exist when imported', () => {
      // arrange
      // act
      // assert
      expect(UserPrivilegeService).toBeDefined();
    });

    it('should exist when instantiated', () => {
      // arrange
      // act
      // assert
      expect(service).toBeDefined();
    });

    describe('getAllPrivilegeSets', () => {
      test('should get all privilge sets when invokced', async () => {
        // arrange
        // act
        const result = await service.getAllPrivilegeSets();
        // assert
        expect(Array.isArray(result)).toBe(true);
        expect(result).toHaveLength(3);

        const toUpdate = result.find(
          (privilgeSet) => privilgeSet.name === USER_ROLE.USER
        );
        if (toUpdate) {
          idToUpdate = toUpdate.id;
          initialDescription = toUpdate.description;
        }
      });
    });

    describe('updatePrivilegeSet', () => {
      test('should throw when id not passed', async () => {
        // arrange
        // act
        // assert
        try {
          expect(await service.updatePrivilegeSet('', null)).toThrow();
        } catch (err) {
          expect(err.message).toEqual('No id provided.');
        }
      });

      test('should update privilege set when all is good.', async () => {
        // arrange
        const data: UpdatePrivilegeSetPayloadType = {
          description: 'Full App Access',
        };
        // act
        const result = await service.updatePrivilegeSet(idToUpdate, data);
        // assert
        expect(result).toBeDefined();
      });

      test('should update privilege set when all is good.', async () => {
        // arrange
        const data: UpdatePrivilegeSetPayloadType = {
          description: initialDescription,
        };
        // act
        const result = await service.updatePrivilegeSet(idToUpdate, data);
        // assert
        expect(result).toBeDefined();
      });
    });
  } else {
    it('should exist when imported', () => {
      // arrange
      // act
      // assert
      expect(UserPrivilegeService).toBeDefined();
    });

    it('should exist when instantiated', () => {
      // arrange
      // act
      const service = new UserPrivilegeService();
      // assert
      expect(service).toBeDefined();
    });

    it('should have all methods', () => {
      // arrange
      // act
      const service = new UserPrivilegeService();
      // assert
      expect(service.getAllPrivilegeSets).toBeDefined();
      expect(service.updatePrivilegeSet).toBeDefined();
    });
  }
});
