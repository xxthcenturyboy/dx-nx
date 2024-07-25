import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import { jwtDecode } from "jwt-decode";
import storage from 'reduxjs-toolkit-persist/lib/storage';
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1';
import { PersistConfig } from 'reduxjs-toolkit-persist/lib/types';

import { AuthStateType } from './auth-web.types';
import { AUTH_ENTITY_NAME } from './auth-web.consts';
import { JwtPayloadType } from '@dx/auth-shared';

export const authInitialState: AuthStateType = {
  password: null,
  token: null,
  userId: null,
  username: null
};

export const authPersistConfig: PersistConfig<AuthStateType> = {
  key: AUTH_ENTITY_NAME,
  blacklist: ['password'],
  storage,
  stateReconciler: autoMergeLevel1,
};

const authSlice = createSlice({
  name: AUTH_ENTITY_NAME,
  initialState: authInitialState,
  reducers: {
    passwordUpdated(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    tokenAdded(state, action: PayloadAction<string>) {
      const tokenDecoded = jwtDecode<JwtPayloadType>(action.payload);
      state.token = action.payload;
      state.userId = tokenDecoded?._id || null;
    },
    tokenRemoved(state, action: PayloadAction<undefined>) {
      state.token = null;
      state.userId = null;
    },
    usernameUpdated(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export const authReducer = authSlice.reducer;
