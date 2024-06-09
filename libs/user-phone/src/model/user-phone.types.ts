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
