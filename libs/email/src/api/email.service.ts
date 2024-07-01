import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger';
import { EmailModel } from '../model/email.postgres-model';
import {
  CreateEmailPayloadType,
  UpdateEmailPayloadType
} from '../model/email.types';
import { EmailUtil } from '@dx/utils';
import { isLocal } from '@dx/config';
import { OtpService } from '@dx/auth';

export class EmailService {
  private LOCAL = isLocal();
  private logger: ApiLoggingClassType;

  constructor() {
    this.logger = ApiLoggingClass.instance;
  }

  public async createEmail(payload: CreateEmailPayloadType) {
    const {
      code,
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

    const emailUtil = new EmailUtil(email);
    const isEmailAvailable = await EmailModel.isEmailAvailable(emailUtil.formattedEmail());
    if (!isEmailAvailable) {
      throw new Error(`This email: ${email} already exists.`);
    }

    if (!emailUtil.validate()) {
      if (emailUtil.isDisposableDomain()) {
        throw new Error('The email you provided is not valid. Please note that we do not allow disposable emails or emails that do not exist, so make sure to use a real email address.');
      }

      throw new Error('The email you provided is not valid.');
    }

    const isCodeValid = await OtpService.validateOptCode(userId, code);
    if (!isCodeValid) {
      throw new Error('Invalid OTP code.');
    }

    if (def === true) {
      await EmailModel.clearAllDefaultByUserId(userId);
    }

    try {
      const userEmail = new EmailModel();
      userEmail.userId = userId;
      userEmail.email = emailUtil.formattedEmail();
      userEmail.label = label;
      userEmail.default = def;
      userEmail.verifiedAt = new Date();
      await userEmail.save();

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

  // TODO: Only used in test - remove when can
  public async validateTestEmail(email: string) {
    if (this.LOCAL) {
      await EmailModel.validateEmail(email);
    }
  }

  // TODO: Only used in test - remove when can
  public async deleteTestEmail(id: string) {
    if (this.LOCAL) {
      await EmailModel.destroy({
        where: {
          id,
        },
        force: true
      });
    }
  }
}

export type EmailServiceType = typeof EmailService.prototype;
