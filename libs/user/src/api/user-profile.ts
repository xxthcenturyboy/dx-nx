import { UserModel } from '../model/user.postgres-model';
import { UserProfileStateType } from '../model/user.types';
import { ApiLoggingClass } from '@dx/logger';

export async function getUserProfileState(
  user: UserModel,
  isAuthenticated: boolean
): Promise<UserProfileStateType> {
  try {
    // common items
    const id = user.id;
    const defaultEmail = user.emails.find(e => e.default);
    const defaultPhone = user.phones.find(e => e.default);
    const mailVerified = !!defaultEmail?.verifiedAt;
    const phoneVerified = !!defaultPhone?.verifiedAt;

    const profile: UserProfileStateType = {
      id,
      emails: await user.getEmailData(),
      firstName: user.firstName,
      fullName: user.fullName,
      hasSecuredAccount: (!!user.hashword && mailVerified) || phoneVerified,
      hasVerifiedEmail: mailVerified,
      hasVerifiedPhone: phoneVerified,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      lastName: user.lastName,
      optInBeta: user.optInBeta,
      phones: await user.getPhoneData(),
      restrictions: user.restrictions || [],
      role: user.roles,
      username: user.username
    };

    return profile;
  } catch (err) {
    const msg = `Error resolving user profile: ${err.message || err}`;
    ApiLoggingClass.instance.logError(msg);
    throw new Error(msg);
  }
}
