import storage from 'reduxjs-toolkit-persist/lib/storage';
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1';

import { AuthStateType } from '../model/auth.types';
import { AUTH_ENTITY_NAME } from '../model/auth.consts';

export const authInitialState: AuthStateType = {
  token: null,
  userId: null,
};

export const authPersistConfig = {
  key: AUTH_ENTITY_NAME,
  blacklist: ['password', 'passwordConfirmation'],
  storage,
  stateReconciler: autoMergeLevel1
};
