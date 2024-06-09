import { UserPrivilegesResponseType } from '../model/user-privileges.types';

export class UserPrivilegesService {
  public getData(): UserPrivilegesResponseType {
    return { message: 'user-privileges' };
  }
}

export type UserPrivilegesServiceType = typeof UserPrivilegesService.prototype;
