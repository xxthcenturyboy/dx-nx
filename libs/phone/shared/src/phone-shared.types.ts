export type PhoneType = {
  id: string;
  countryCode: string;
  regionCode?: string;
  default: boolean;
  phone: string;
  label: string;
  phoneFormatted: string;
  isDeleted: boolean;
  isSent: boolean;
  isVerified: boolean;
  uiFormatted?: string;
};
