import sgMail,
{
  MailDataRequired
} from '@sendgrid/mail';
import sgClient from '@sendgrid/client';

import { SG_TEMPLATES } from './templates.sendgrid';
import {
  APP_DOMAIN,
  COMPANY_NAME,
  isProd,
  isTest,
  SENDGRID_API_KEY,
  SENDGRID_URL
} from '@dx/config';
import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger';
import { DISPOSABLE_EMAIL_DOMAINS } from '@dx/config';

export class MailSendgrid {
  private fromAddress: string;
  logger: ApiLoggingClassType;

  constructor() {
    this.fromAddress = `${COMPANY_NAME} <noreply@${APP_DOMAIN}>`;
    this.logger = ApiLoggingClass.instance;

    if (isTest()) {
      sgClient.setApiKey(SENDGRID_API_KEY);
      sgClient.setDefaultRequest('baseUrl', SENDGRID_URL);
      sgMail.setClient(sgClient);
    } else {
      sgMail.setApiKey(SENDGRID_API_KEY);
    }
    sgMail.setSubstitutionWrappers('%', '%');
  }

  // TODO: Do this elsewhere
  private validate(email: string): boolean {
    // Always return true for app domain urls
    if (email.endsWith(`@${APP_DOMAIN}`)) {
      return true;
    }
    // only run on production
    if (isProd()) {
      const emailDomain = email.slice(email.indexOf('@') + 1);
      const isDisposable = DISPOSABLE_EMAIL_DOMAINS[emailDomain] as boolean;
      return isDisposable;
    }

    return true;
  }

  private async sendMail(mailData: MailDataRequired): Promise<string> {
    const res = await sgMail.send(mailData);
    const sgId = isTest()
      ? res[0].headers['etag']
      : res[0].headers['x-message-id']
    return sgId || 'no-id-for-sendgrid';
  }

  public async sendConfirmation(
    to: string,
    confirmUrl: string
  ): Promise<string> {
    const mailData: MailDataRequired = {
      to,
      from: this.fromAddress,
      templateId: SG_TEMPLATES.CONFIRM,
      dynamicTemplateData: {
        confirmUrl
      }
    };

    try {
      this.logger.logInfo(`Sending confirmation mail to ${to}`);
      const valid = this.validate(to);
      if (!valid) {
        throw Error(`Email failed validation ${to}`);
      }

      const sgMessageId = await this.sendMail(mailData);

      if (!sgMessageId) {
        throw new Error(`Could not send email to ${to}.`);
      }

      return sgMessageId;
    } catch (err) {
      this.logger.logError(`Error sending email to ${to}`);
      this.logger.logError(err);
      throw new Error(err.message);
    }
  }

  public async sendInvite(
    to: string,
    inviteUrl: string,
    from?: string
  ): Promise<string> {
    const mailData: MailDataRequired = {
      to,
      from: from || this.fromAddress,
      templateId: SG_TEMPLATES.INVITE,
      dynamicTemplateData: {
        inviteUrl
      }
    };

    try {
      this.logger.logInfo(`Sending invite mail to ${to}`);
      const valid = this.validate(to);
      if (!valid) {
        throw Error(`Email failed validation ${to}`);
      }

      const sgMessageId = await this.sendMail(mailData);

      if (!sgMessageId) {
        throw new Error(`Could not send email to ${to}.`);
      }

      return sgMessageId;
    } catch (err) {
      this.logger.logError(`Error sending email to ${to}`);
      this.logger.logError(err);
      throw new Error(err.message);
    }
  }

  public async sendReset(
    to: string,
    resetUrl: string
  ): Promise<string> {
    const mailData: MailDataRequired = {
      to,
      from: this.fromAddress,
      templateId: SG_TEMPLATES.RESET,
      dynamicTemplateData: {
        resetUrl,
      },
    };

    try {
      this.logger.logInfo(`Sending account reset mail to ${to}`);
      const valid = this.validate(to);
      if (!valid) {
        throw Error(`Email failed validation ${to}`);
      }

      const sgMessageId = await this.sendMail(mailData);

      if (!sgMessageId) {
        throw new Error(`Could not send email to ${to}.`);
      }

      return sgMessageId;
    } catch (err) {
      this.logger.logError(`Error sending email to ${to}`);
      this.logger.logError(err);
      throw new Error(err.message);
    }
  }

  public async sendOtp(
    to: string,
    otpCode: string,
    lockoutUrl: string
  ): Promise<string> {
    const mailData: MailDataRequired = {
      to,
      from: this.fromAddress,
      templateId: SG_TEMPLATES.OTP,
      dynamicTemplateData: {
        lockoutUrl,
        otpCode,
      },
    };

    try {
      this.logger.logInfo(`Sending OTP code mail to ${to}`);
      const valid = this.validate(to);
      if (!valid) {
        throw Error(`Email failed validation ${to}`);
      }

      const sgMessageId = await this.sendMail(mailData);

      if (!sgMessageId) {
        throw new Error(`Could not send email to ${to}.`);
      }

      return sgMessageId;
    } catch (err) {
      this.logger.logError(`Error sending email to ${to}`);
      this.logger.logError(err);
      throw new Error(err.message);
    }
  }
}

export type MailSendgridType = typeof MailSendgrid.prototype;
