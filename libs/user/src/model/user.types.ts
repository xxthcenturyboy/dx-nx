import { EmailType } from "@dx/email";
import { PhoneType } from "@dx/phone";
import { USER_ROLE } from "./user.consts";
import { UserModelType } from "./user.postgres-model";

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

export type UserProfileStateType = {
  id: string;
  emails: EmailType[];
  firstName: string;
  hasCompletedInvite: boolean;
  isEmailVerified: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  lastName: string;
  optInBeta: boolean;
  phones: PhoneType[];
  restrictions: string[];
  role: string[];
  username: string;
};

export type GetUserProfileReturnType = {
  profile: UserProfileStateType | string | null
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
  rows: UserType[]
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

export type UpdateUserResponseType = {
  userId: string;
};

export type CreateUserPayloadType = {
  email: string;
  roles: string[];
  username: string;
  countryCode?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
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
  oldPassword: string;
  otpCode: string;
};

// User Privileges
export type UpdatePrivilegeSetPayloadType = {
  id?: string;
  name?: keyof typeof USER_ROLE;
  order?: number;
  description?: string;
};

export type UserPrivilegestMenuType = {
  id: string;
  name: string;
  order: number;
};
