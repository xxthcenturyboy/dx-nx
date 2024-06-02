import { UserResponseType } from '../model/user.types';

export class UserService {
  public getData(): UserResponseType {
    return { message: 'user' };
  }
}

export type UserServiceType = typeof UserService.prototype;
