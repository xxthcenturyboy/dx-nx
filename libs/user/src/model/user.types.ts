import { UserEmailType } from '@dx/user-email';
import { UserPhoneType } from '@dx/user-phone';

export type UserResponseType = {
  message: string;
};

export type UserProfileStateType = {
  id: string;
  emails: UserEmailType[];
  firstName: string;
  hasCompletedInvite: boolean;
  isEmailVerified: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  lastName: string;
  optInBeta: boolean;
  phones: UserPhoneType[];
  restrictions: string[];
  role: string[];
  username: string;
};
