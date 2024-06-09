export type RedisExpireOptions = {
  token: 'EX' | 'PX' | 'EXAT' | 'PXAT' | 'KEEPTTL';
  time: number;
};
