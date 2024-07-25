export type CreateEmailPayloadType = {
  code?: string;
  email: string;
  def: boolean;
  label: string;
  signature?: string;
  userId: string;
};

export type UpdateEmailPayloadType = {
  def?: boolean;
  label?: string;
};
