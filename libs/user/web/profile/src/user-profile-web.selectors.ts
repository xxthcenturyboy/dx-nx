import { createSelector } from 'reselect';
import parsePhoneNumber from 'libphonenumber-js';

import { RootState } from '@dx/store-web';
import { UserProfileStateType } from '@dx/user-shared';
import { PhoneType } from '@dx/phone-shared';

const getUserProfile = (state: RootState): UserProfileStateType => state.userProfile;
const getCurrentUserId = (state: RootState): string | null => state.userProfile && state.userProfile.id;

export const selectIsUserProfileValid = createSelector(
  [getCurrentUserId],
  userId => !!userId
);

export const selectHasAdminRole = createSelector(
  [getUserProfile],
  (profile) => {
    return profile.a;
  }
);

export const selectUserEmails = createSelector(
  [getUserProfile],
  (profile) => {
    return profile.emails || [];
  }
);

export const selectUserPhones = createSelector(
  [getUserProfile],
  (profile) => {
    return profile.phones || [];
  }
);

export const selectProfileFormatted = createSelector(
  [getUserProfile],
  (profile) => {
    const nextPhones: PhoneType[] = [];
    for (const phone of profile.phones) {
      const formatted = parsePhoneNumber(phone.phoneFormatted);
      nextPhones.push({
        ...phone,
        uiFormatted: formatted?.formatNational()
      });
    }
    return {
      ...profile,
      phones: nextPhones
    };
  }
);
