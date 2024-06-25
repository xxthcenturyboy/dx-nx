import { EmailType } from "@dx/email";
import { PhoneType } from "@dx/phone";

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
export type UserPrivilegesResponseType = {
  message: string;
};

export type UserPrivilegestMenuType = {
  id: string;
  name: string;
  order: number;
};
