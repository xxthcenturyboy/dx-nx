import { createSelector } from 'reselect';
import parsePhoneNumber from 'libphonenumber-js';

import { RootState } from '@dx/store-web';
import { UserProfileStateType } from '@dx/user-shared';

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

export const selectProfileFormatted = createSelector(
  [getUserProfile],
  (profile) => {
    profile?.phones.forEach((phone) => {
      const formatted = parsePhoneNumber(phone.phoneFormatted);
      phone.uiFormatted = formatted?.formatNational();
    });

    return profile;
  }
);
