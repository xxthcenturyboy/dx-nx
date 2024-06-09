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
