import {
  ApiLoggingClass,
  ApiLoggingClassType
} from '@dx/logger';
import { PhoneModel } from '../model/phone.postgres-model';
import {
  CreatePhonePayloadType,
  UpdatePhonePayloadType
} from '../model/phone.types';
import { isLocal } from '@dx/config';

export class PhoneService {
  private LOCAL: boolean;
  private logger: ApiLoggingClassType;

  constructor() {
    this.LOCAL = isLocal();
    this.logger = ApiLoggingClass.instance;
  }

  public async createPhone(payload: CreatePhonePayloadType) {
    const {
      countryCode,
      def,
      label,
      phone,
      userId,
    } = payload;

    if (
      !userId
      || !phone
      || !countryCode
    ) {
      throw new Error('Not enough information to create a phone.');
    }

    const isPhoneAvailable = await PhoneModel.isPhoneAvailable(phone, countryCode);
    if (!isPhoneAvailable) {
      throw new Error(`This phone: ${phone} already exists.`);
    }

    if (def === true) {
      await PhoneModel.clearAllDefaultByUserId(userId);
    }

    try {
      const userPhone = new PhoneModel();
      userPhone.userId = userId;
      userPhone.countryCode = countryCode;
      userPhone.phone = phone;
      userPhone.label = label;
      userPhone.default = def;
      await userPhone.save();

      return { id: userPhone.id };
    } catch (err) {
      this.logger.logError(err);
    }

    return { id: '' };
  }

  public async deletePhone(id: string) {
    if (!id) {
      throw new Error('No id for delete phone.');
    }

    const phone = await PhoneModel.findByPk(id);

    if (!phone) {
      throw new Error(`Phone could not be found with the id: ${id}`);
    }

    try {
      phone.setDataValue('deletedAt', new Date());
      await phone.save();

      return { id: phone.id };
    } catch (err) {
      this.logger.logError(err);
      return { id: '' };
    }
  }

  public async deleteTestPhone(id: string) {
    if (this.LOCAL) {
      await PhoneModel.destroy({
        where: {
          id,
        },
        force: true
      });
    }
  }

  public async updatePhone(
    id: string,
    payload: UpdatePhonePayloadType
  ) {
    const {
      def,
      label,
    } = payload;

    if (!id) {
      throw new Error('No id for update phone.');
    }

    const phone = await PhoneModel.findByPk(id);

    if (!phone) {
      throw new Error(`Phone could not be found with the id: ${id}`);
    }

    try {
      if (def === true) {
        await PhoneModel.clearAllDefaultByUserId(phone.userId);
      }

      if (def !== undefined) {
        phone.setDataValue('default', def);
      }
      if (label !== undefined && typeof label === 'string') {
        phone.setDataValue('label', label);
      }

      await phone.save();

      return { id };
    } catch (err) {
      this.logger.logError(err);
      throw new Error(err.message || 'Phone could not be updated.');
    }
  }
}

export type PhoneServiceType = typeof PhoneService.prototype;
