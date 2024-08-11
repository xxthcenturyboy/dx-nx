import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1';
import { PersistConfig } from 'reduxjs-toolkit-persist/lib/types';

import { PrivilegeSetDataType } from '@dx/user-privilege-shared';
import {
  PrivilegeSetStateType
} from './privilege-set-web.types';
import { PRIVILEGE_SET_WEB_ENTITY_NAME } from './privilege-set-web.consts';

export const privilegeSetInitialState: PrivilegeSetStateType = {
  sets: [],
};

export const privilegeSetPersistConfig: PersistConfig<PrivilegeSetStateType> = {
  key: PRIVILEGE_SET_WEB_ENTITY_NAME,
  storage,
  stateReconciler: autoMergeLevel1,
};

const privilegeSetSlice = createSlice({
  name: PRIVILEGE_SET_WEB_ENTITY_NAME,
  initialState: privilegeSetInitialState,
  reducers: {
    setPrivileges(state, action: PayloadAction<PrivilegeSetDataType[]>) {
      state.sets = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const privilegeSetActions = privilegeSetSlice.actions;

export const privilegeSetReducer = privilegeSetSlice.reducer;
