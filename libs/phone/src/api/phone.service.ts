import { PhoneResponseType } from '../model/phone.types';

export class PhoneService {
  public getData(): PhoneResponseType {
    return { message: 'phone' };
  }
}

export type PhoneServiceType = typeof PhoneService.prototype;
