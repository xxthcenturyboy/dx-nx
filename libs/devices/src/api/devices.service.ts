import { DevicesResponseType } from '../model/devices.types';

export class DevicesService {
  public getData(): DevicesResponseType {
    return { message: 'devices' };
  }
}

export type DevicesServiceType = typeof DevicesService.prototype;
