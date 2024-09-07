import { ApiLoggingClass } from '@dx/logger-api';
import { UserModel } from './user.postgres-model';
import { UserProfileStateType } from '@dx/user-shared';
import { MediaModel } from '@dx/media-api';

export async function getUserProfileState(
  user: UserModel,
  isAuthenticated: boolean
): Promise<UserProfileStateType> {
  try {
    // common items
    const id = user.id;
    const defaultEmail = user.emails.find((e) => e.default);
    const defaultPhone = user.phones.find((e) => e.default);
    const mailVerified = !!defaultEmail?.verifiedAt;
    const phoneVerified = !!defaultPhone?.verifiedAt;
    const connectedDevice = await user.fetchConnectedDevice();
    const profileImage = await MediaModel.findPrimaryProfile(id)

    const profile: UserProfileStateType = {
      id,
      device: {
        id: connectedDevice?.id || '',
        hasBiometricSetup: connectedDevice?.hasBiometricSetup || false,
      },
      emails: await user.getEmailData(),
      firstName: user.firstName,
      fullName: user.fullName,
      hasSecuredAccount: await user.hasSecuredAccount(),
      hasVerifiedEmail: mailVerified,
      hasVerifiedPhone: phoneVerified,
      a: user.isAdmin,
      sa: user.isSuperAdmin,
      lastName: user.lastName,
      b: user.optInBeta,
      phones: await user.getPhoneData(),
      profileImage: profileImage?.id || null,
      restrictions: user.restrictions || [],
      role: user.roles,
      username: user.username,
    };

    return profile;
  } catch (err) {
    const msg = `Error resolving user profile: ${err.message || err}`;
    ApiLoggingClass.instance.logError(msg);
    throw new Error(msg);
  }
}
