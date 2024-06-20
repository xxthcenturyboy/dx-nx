export type JwtPayloadType = {
  sub: string;
  exp: number;
  issuer: string;
  audience: string;
};

export type RefreshCacheType = {
  [token: string]: boolean;
};
