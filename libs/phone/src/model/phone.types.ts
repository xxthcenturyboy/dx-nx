export type CreatePhonePayloadType = {
  code: string;
  countryCode: string;
  regionCode?: string;
  def: boolean;
  label: string;
  phone: string;
  userId: string;
};

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

export type UpdatePhonePayloadType = {
  def?: boolean;
  label?: string;
};
