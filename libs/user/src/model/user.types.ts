import { EmailType } from "@dx/email";
import { PhoneType } from "@dx/phone";
import { USER_ROLE } from "./user.consts";

export type UserResponseType = {
  message: string;
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
