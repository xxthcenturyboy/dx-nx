import { EmailType } from '@dx/email-shared';
import { PhoneType } from '@dx/phone-shared';

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

export type UserProfileDeviceType = {
  id: string;
  hasBiometricSetup: boolean;
};

export type UserProfileStateType = {
  id: string;
  device: UserProfileDeviceType;
  emails: EmailType[];
  firstName: string;
  fullName: string;
  hasSecuredAccount: boolean;
  hasVerifiedEmail: boolean;
  hasVerifiedPhone: boolean;
  a: boolean;
  sa: boolean;
  lastName: string;
  b: boolean;
  phones: PhoneType[];
  restrictions: string[];
  role: string[];
  username: string;
};
