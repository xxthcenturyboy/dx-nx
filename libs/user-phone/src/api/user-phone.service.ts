import { UserPhoneResponseType } from '../model/user-phone.types';

export class UserPhoneService {
  public getData(): UserPhoneResponseType {
    return { message: 'user-phone' };
  }
}

export type UserPhoneServiceType = typeof UserPhoneService.prototype;
