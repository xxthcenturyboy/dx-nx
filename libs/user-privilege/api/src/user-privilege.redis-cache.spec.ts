import { ApiLoggingClass } from '@dx/logger-api';
import {
  UserPrivilegeSetCache,
  UserPrivilegeSetCacheType,
} from './user-privilege.redis-cache';
import { UserPrivilegeSetModelType } from './user-privilege.postgres-model';
import { randomUUID } from 'crypto';
import { RedisService } from '@dx/data-access-redis';
import { getRedisConfig } from '@dx/config-api';

jest.mock('@dx/logger');

describe('UserPrivilegeSetCache', () => {
  let cache: UserPrivilegeSetCacheType;
  // @ts-expect-error - ok for test
  const data0: UserPrivilegeSetModelType = {
    id: randomUUID(),
    name: 'SUPER_ADMIN',
    description: 'Sudo',
    order: 0,
  };
  // @ts-expect-error - ok for test
  const data1: UserPrivilegeSetModelType = {
    id: randomUUID(),
    name: 'ADMIN',
    description: 'Add Users',
    order: 1,
  };
  // @ts-expect-error - ok for test
  const data2: UserPrivilegeSetModelType = {
    id: randomUUID(),
    name: 'USER',
    description: 'App Access',
    order: 2,
  };

  beforeAll(async () => {
    new ApiLoggingClass({ appName: 'Unit-Test' });
    const redisConfig = getRedisConfig();
    new RedisService({
      isLocal: true,
      isTest: true,
      redis: redisConfig,
    });
  });

  beforeEach(() => {
    cache = new UserPrivilegeSetCache();
  });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('should exist when imported', () => {
    // arrange
    // act
    // assert
    expect(UserPrivilegeSetCache).toBeDefined();
  });

  it('should exist when instantiated', () => {
    // arrange
    // act
    // assert
    expect(cache).toBeDefined();
  });

  describe('setCache', () => {
    test('should return false no data is passed', async () => {
      // arrange
      // act
      const result = await cache.setCache('ADMIN', null);
      // assert
      expect(result).toBeFalsy();
    });
    test('should set Data0 to Cache when all is good', async () => {
      // arrange
      // act
      const result = await cache.setCache(data0.name, data0);
      // assert
      expect(result).toBeTruthy();
    });
    test('should set Data1 to Cache when all is good', async () => {
      // arrange
      // act
      const result = await cache.setCache(data1.name, data1);
      // assert
      expect(result).toBeTruthy();
    });
    test('should set Data2 to Cache when all is good', async () => {
      // arrange
      // act
      const result = await cache.setCache(data2.name, data2);
      // assert
      expect(result).toBeTruthy();
    });
  });

  describe('getCache', () => {
    test('return null when privilege set name not passed', async () => {
      // arrange
      // act
      const result = await cache.getCache(null);
      // assert
      expect(result).toBeFalsy();
    });
    test('should return privilge set when exists', async () => {
      // arrange
      // act
      const result = await cache.getCache(data0.name);
      // assert
      expect(result).toEqual(data0);
    });
  });

  describe('getAllPrivilegeSets', () => {
    test('should get array of privileget sets by the namespace when invoked', async () => {
      // arrange
      // act
      const result = await cache.getAllPrivilegeSets();
      // assert
      expect(result).toHaveLength(3);
      expect(result.sort((a, b) => a.order - b.order)).toEqual([
        data0,
        data1,
        data2,
      ]);
    });
  });
});
