import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger';
import { EmailModel } from '../model/email.postgres-model';
import {
  CreateEmailPayloadType,
  UpdateEmailPayloadType
} from '../model/email.types';
import { randomId } from '@dx/utils';
import { MailSendgrid } from '@dx/mail';
import { ShortLinkModel } from '@dx/shortlink';
import { isLocal } from '@dx/config';

export class EmailService {
  private LOCAL = isLocal();
  private logger: ApiLoggingClassType;

  constructor() {
    this.logger = ApiLoggingClass.instance;
  }

  public async createEmail(payload: CreateEmailPayloadType) {
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
      throw new Error('Not enough information to create an email.');
    }

    const isEmailAvailable = await EmailModel.isEmailAvailable(email);
    if (!isEmailAvailable) {
      throw new Error(`This email: ${email} already exists.`);
    }

    await EmailModel.assertEmailIsValid(email);

    if (def === true) {
      await EmailModel.clearAllDefaultByUserId(userId);
    }

    try {
      const token = randomId();
      const userEmail = new EmailModel();
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

  public async deleteEmail(id: string) {
    if (!id) {
      throw new Error('No id for delete email.');
    }

    const email = await EmailModel.findByPk(id);

    if (!email) {
      throw new Error(`Email could not be found with the id: ${id}`);
    }
    try {
      email.setDataValue('deletedAt', new Date());
      await email.save();

      return { id: email.id };
    } catch (err) {
      this.logger.logError(err);
      return { id: '' };
    }
  }

  public async updateEmail(
    id: string,
    payload: UpdateEmailPayloadType
  ) {
    const {
      def,
      label,
    } = payload;

    if (!id) {
      throw new Error('No id for update email.');
    }

    const email = await EmailModel.findByPk(id);

    if (!email) {
      throw new Error(`Email could not be found with the id: ${id}`);
    }

    try {
      if (def === true) {
        await EmailModel.clearAllDefaultByUserId(email.userId);
      }

      if (def !== undefined) {
        email.setDataValue('default', def);
      }
      if (label !== undefined && typeof label === 'string') {
        email.setDataValue('label', label);
      }

      await email.save();

      return { id };
    } catch (err) {
      this.logger.logError(err);
      throw new EmailModel(err.message || 'Email could not be updated.');
    }
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

  public async validateTestEmail(email: string) {
    if (this.LOCAL) {
      await EmailModel.validateEmail(email);
    }
  }
}

export type EmailServiceType = typeof EmailService.prototype;
