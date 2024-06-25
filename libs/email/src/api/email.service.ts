import { EmailResponseType } from '../model/email.types';

export class EmailService {
  public getData(): EmailResponseType {
    return { message: 'email' };
  }
}

export type EmailServiceType = typeof EmailService.prototype;
