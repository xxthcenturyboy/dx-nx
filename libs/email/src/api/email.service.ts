import { randomUUID } from 'crypto';

import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger';
import { EmailModel } from '../model/email.postgres-model';
import { CreateEmailPayloadType } from '../model/email.types';
import { randomId } from '@dx/utils';
import { MailSendgrid } from '@dx/mail';
import { ShortLinkModel } from '@dx/shortlink';

export class EmailService {
  private logger: ApiLoggingClassType;

  constructor() {
    this.logger = ApiLoggingClass.instance;
  }

  public async createEmail(payload: CreateEmailPayloadType) {
    try {
      const {
        def,
        email,
        label,
        userId,
      } = payload;

      if (
        !userId
        || !email
      ) {
        throw new Error('Not enough information to create an email');
      }

      const isEmailAvailable = await EmailModel.isEmailAvailable(email);
      if (!isEmailAvailable) {
        throw new Error(`This email: ${email} already exists.`);
      }

      await EmailModel.assertEmailIsValid(email);

      if (def === true) {
        await EmailModel.clearAllDefaultByUserId(userId);
      }

      const token = randomId();
      const userEmail = new EmailModel();
      userEmail.id = randomUUID();
      userEmail.userId = userId;
      userEmail.email = email;
      userEmail.label = label;
      userEmail.default = def;
      userEmail.token = token.toString();

      await userEmail.save();

      const mail = new MailSendgrid();
      const validationUrl = `/auth/z?route=validate-email&token=${token}`;
      const shortLink = await ShortLinkModel.generateShortlink(validationUrl);
      const sendgridId = await mail.sendConfirmation(email, shortLink);
      await EmailModel.updateMessageInfoValidate(email, sendgridId);

      return { id: userEmail.id };
    } catch (err) {
      this.logger.logError(err);
    }

    return { id: '' };
  }

  public async validateEmail(token: string) {
    if (!token) {
      throw new Error('No Token for validate email.');
    }
    try {
      const email = await EmailModel.validateEmailWithToken(token);

      if (!email) {
        throw new Error(`Email could not be found with the tokan: ${token}`);
      }

      return { id: email.id };
    } catch (err) {
      this.logger.logError(err.message);
    }

    return { id: '' };
  }
}

export type EmailServiceType = typeof EmailService.prototype;
