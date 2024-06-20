import { AuthResponseType } from '../model/auth.types';

export class AuthService {
  public getData(): AuthResponseType {
    return { message: 'auth' };
  }
}

export type AuthServiceType = typeof AuthService.prototype;
