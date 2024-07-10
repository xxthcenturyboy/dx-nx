export type RedisExpireOptions = {
  token: 'EX' | 'PX' | 'EXAT' | 'PXAT' | 'KEEPTTL';
  time: number;
};

export type RedisConfigType = {
  port: number;
  prefix: string;
  url: string;
};

export type RedisConstructorType = {
  isLocal: boolean;
  redis: RedisConfigType;
  isTest?: boolean;
};

export type RedisHealthzResponse = {
  ping: boolean;
  read: boolean;
  write: boolean;
};

// export type RedisHealthzConstructorType = {
//   logger: ApiLoggingClassType;
//   cacheService: RedisServiceType;
// };
