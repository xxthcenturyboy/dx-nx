import { PersistConfig } from 'redux-persist';
import storageSession from "redux-persist/lib/storage/session";
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import { AuthStateType } from '../model/auth.types';
import { AUTH_ENTITY_NAME } from '../model/auth.consts';

export const authInitialState: AuthStateType = {
  token: ''
};

export const authPersistConfig: PersistConfig<AuthStateType> = {
  key: AUTH_ENTITY_NAME,
  blacklist: ['password', 'passwordConfirmation'],
  stateReconciler: autoMergeLevel2,
  storage: storageSession,
};
