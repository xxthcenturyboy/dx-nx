export type EmailType = {
  id: string;
  email: string;
  label: string;
  default: boolean;
  isDeleted: boolean;
  isVerified: boolean;
};

export type CreateEmailPayloadType = {
  code: string;
  email: string;
  def: boolean;
  label: string;
  userId: string;
};

export type UpdateEmailPayloadType = {
  def?: boolean;
  label?: string;
};
