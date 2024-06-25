import { ShortlinkResponseType } from '../model/shortlink.types';

export class ShortlinkService {
  public getData(): ShortlinkResponseType {
    return { message: 'shortlink' };
  }
}

export type ShortlinkServiceType = typeof ShortlinkService.prototype;
