import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1';
import { PersistConfig } from 'reduxjs-toolkit-persist/lib/types';

import { UserProfileStateType } from '@dx/user-shared';
import { USER_PROFILE_ENTITY_NAME } from './user-profile-web.consts';
import { EmailType } from '@dx/email-shared';
import { PhoneType } from '@dx/phone-shared';

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
      state.device = action.payload.device;
      state.emails = action.payload.emails;
      state.firstName = action.payload.firstName;
      state.fullName = action.payload.fullName;
      state.hasSecuredAccount = action.payload.hasSecuredAccount;
      state.hasVerifiedEmail = action.payload.hasVerifiedEmail;
      state.hasVerifiedPhone = action.payload.hasVerifiedPhone;
      state.id = action.payload.id;
      state.a = action.payload.a;
      state.sa = action.payload.sa;
      state.lastName = action.payload.lastName;
      state.phones = action.payload.phones;
      state.restrictions = action.payload.restrictions;
      state.role = action.payload.role;
      state.username = action.payload.username;
    },
    profileInvalidated(state, action: PayloadAction<undefined>) {
      state.device = userProfileInitialState.device;
      state.emails = userProfileInitialState.emails;
      state.firstName = userProfileInitialState.firstName;
      state.fullName = userProfileInitialState.fullName;
      state.hasSecuredAccount = userProfileInitialState.hasSecuredAccount;
      state.hasVerifiedEmail = userProfileInitialState.hasVerifiedEmail;
      state.hasVerifiedPhone = userProfileInitialState.hasVerifiedPhone;
      state.id = userProfileInitialState.id;
      state.a = userProfileInitialState.a;
      state.sa = userProfileInitialState.sa;
      state.lastName = userProfileInitialState.lastName;
      state.phones = userProfileInitialState.phones;
      state.restrictions = userProfileInitialState.restrictions;
      state.role = userProfileInitialState.role;
      state.username = userProfileInitialState.username;
    },
    emailAddedToProfile(state, action: PayloadAction<EmailType>) {
      const nextEmails = state.emails;
      nextEmails.push(action.payload);
      state.emails = nextEmails;
    },
    emailRemovedFromProfile(state, action: PayloadAction<string>) {
      const nextEmails = state.emails.filter(email => email.id !== action.payload);
      state.emails = nextEmails;
    },
    phoneAddedToProfile(state, action: PayloadAction<PhoneType>) {
      const nextPhones = state.phones;
      nextPhones.push(action.payload);
      state.phones = nextPhones;
    },
    phoneRemovedFromProfile(state, action: PayloadAction<string>) {
      const nextPhones = state.phones.filter(phone => phone.id !== action.payload);
      state.phones = nextPhones;
    }
  },
});

export const userProfileActions = userProfileSlice.actions;

export const userProfileReducer = userProfileSlice.reducer;
