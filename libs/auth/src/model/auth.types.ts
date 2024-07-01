export type AccountCreationPayloadType = {
  code: string;
  region?: string;
  value: string;
};

export type UserLookupResponseType = {
  available: boolean;
};

export type UserLookupQueryType = {
  type: string;
  value: string;
  code?: string;
  region?: string;
};

export type LoginPaylodType = {
  value: string;
  biometric?: string;
  code?: string;
  region?: string;
  password?: string;
};

export type OtpLockoutResponseType = {
  locked: boolean;
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
