import { EmailType } from '@dx/email-shared';
import { PhoneType } from '@dx/phone-shared';
import {
  UserProfileDeviceType,
  UserProfileStateType
} from '@dx/user-shared';

export type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  emails: EmailType[];
  phones: PhoneType[];
  optInBeta: boolean;
  roles: string[];
  username: string;
  restrictions: string[];
};

export type UserSessionType = {
  id: string;
  fullName: string;
  hasSecuredAccount: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  optInBeta: boolean;
  roles: string[];
  username: string;
  restrictions: string[];
};

export type GetUserProfileReturnType = {
  profile: UserProfileStateType | string | null;
};

export type GetUsersListQueryType = {
  filterValue?: string;
  limit?: string | number;
  offset?: string | number;
  orderBy?: string;
  sortDir?: string;
};

export type GetUserListResponseType = {
  count: number;
  rows: UserType[];
};

export type GetUserQueryType = {
  id?: string;
};

export type GetUserResponseType = UserType;

export type UpdateUserPayloadType = {
  firstName?: string;
  lastName?: string;
  roles?: string[];
  restrictions?: string[];
};

export type UpdateUsernamePayloadType = {
  otpCode?: string;
  signature?: string;
  username: string;
};

export type UpdateUserResponseType = {
  userId: string;
};

export type CreateUserResponseType = {
  id: string;
  invited: boolean;
};

export type ResendInvitePayloadType = {
  id: string;
  email: string;
};

export type SendInviteResponseType = {
  invited: boolean;
};

export type OtpCodeResponseType = {
  codeSent: boolean;
};

export type UpdatePasswordPayloadType = {
  id: string;
  password: string;
  passwordConfirm: string;
  otpCode?: string;
  signature?: string;
};
