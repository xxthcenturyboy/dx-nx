export type UserLookupResponseType = {
  available: boolean;
};

export type UserLookupQueryType = {
  type: string;
  value: string;
  code?: string;
};

export type GetByTokenQueryType = {
  token: string;
};

export type TokenConfirmationResponseType = {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  username: string
};

export type LoginPaylodType = {
  email: string;
  password: string;
};

export type OtpLockoutResponseType = {
  locked: boolean;
};

export type SetupPasswordsPaylodType = {
  id: string;
  password: string;
  securityAA: string;
  securityQQ: string;
};

export type SessionData = {
  userId?: string;
  refreshToken?: string;
  redirectTo?: string;
  cancelUrl?: string;
  referralToken?: string;
  oauthRequestToken?: undefined;
  oauthRequestTokenSecret?: undefined;
  destroy?: (any) => void;
};

export type SignupPayloadType = {
  email: string;
  password: string;
  passwordConfirm: string;
  recaptcha?: string;
  redirectUrl?: string;
};
