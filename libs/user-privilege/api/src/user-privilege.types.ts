import { USER_ROLE } from './user-privilege.consts';

export type UpdatePrivilegeSetPayloadType = {
  id?: string;
  name?: keyof typeof USER_ROLE;
  order?: number;
  description?: string;
};

export type UserPrivilegestMenuType = {
  id: string;
  name: string;
  order: number;
};
