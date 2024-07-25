export type CreatePhonePayloadType = {
  code?: string;
  countryCode: string;
  regionCode?: string;
  def: boolean;
  label: string;
  phone: string;
  signature?: string;
  userId: string;
};

export type UpdatePhonePayloadType = {
  def?: boolean;
  label?: string;
};
