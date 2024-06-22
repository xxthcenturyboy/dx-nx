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

// User Email
export type UserEmailResponseType = {
  message: string;
};

export type UserEmailType = {
  id: string;
  email: string;
  label: string;
  default: boolean;
  isDeleted: boolean;
  isVerified: boolean;
};

// User Phone
export type UserPhoneResponseType = {
  message: string;
};

export type UserPhoneType = {
  id: string;
  countryCode: string;
  default: boolean;
  phone: string;
  label: string;
  phoneFormatted: string;
  isDeleted: boolean;
  isSent: boolean;
  isVerified: boolean;
  uiFormatted?: string;
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
