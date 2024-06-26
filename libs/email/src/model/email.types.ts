export type EmailType = {
  id: string;
  email: string;
  label: string;
  default: boolean;
  isDeleted: boolean;
  isVerified: boolean;
};

export type CreateEmailPayloadType = {
  email: string;
  def: boolean;
  label: string;
  userId: string;
};
