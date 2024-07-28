import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1';
import { PersistConfig } from 'reduxjs-toolkit-persist/lib/types';

import { UserProfileStateType } from '@dx/user-shared';
import { USER_PROFILE_ENTITY_NAME } from './user-profile-web.consts';

export const userProfileInitialState: UserProfileStateType = {
  id: '',
  device: {
    id: '',
    hasBiometricSetup: false
  },
  emails: [],
  firstName: '',
  fullName: '',
  hasSecuredAccount: false,
  hasVerifiedEmail: false,
  hasVerifiedPhone: false,
  a: false,
  sa: false,
  lastName: '',
  b: false,
  phones: [],
  restrictions: [],
  role: [],
  username: ''
};

export const userProfilePersistConfig: PersistConfig<UserProfileStateType> = {
  key: USER_PROFILE_ENTITY_NAME,
  // blacklist: ['password'],
  storage,
  stateReconciler: autoMergeLevel1,
};

const userProfileSlice = createSlice({
  name: USER_PROFILE_ENTITY_NAME,
  initialState: userProfileInitialState,
  reducers: {
    profileUpdated(state, action: PayloadAction<UserProfileStateType>) {
      state = action.payload;
    },
    profileInvalidated(state, action: PayloadAction<undefined>) {
      state = userProfileInitialState;
    }
  },
});

export const userProfileActions = userProfileSlice.actions;

export const userProfileReducer = userProfileSlice.reducer;
