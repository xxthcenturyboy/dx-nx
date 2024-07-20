export type CreateUserPayloadType = {
  email: string;
  roles: string[];
  username: string;
  countryCode?: string;
  isTest?: boolean;
  regionCode?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};
