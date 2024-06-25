export type EmailResponseType = {
  message: string;
};

export type EmailType = {
  id: string;
  email: string;
  label: string;
  default: boolean;
  isDeleted: boolean;
  isVerified: boolean;
};
