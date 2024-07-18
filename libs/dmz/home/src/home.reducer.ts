import { createSlice } from '@reduxjs/toolkit';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1';

import { HomeStateType } from './home.types';
import { HOME_ENTITY_NAME } from './home.consts';

export const homeInitialState: HomeStateType = {
  a: null
};

export const homePersistConfig = {
  key: HOME_ENTITY_NAME,
  // blacklist: ['password', 'passwordConfirmation'],
  storage,
  stateReconciler: autoMergeLevel1,
};

const homeSlice = createSlice({
  name: HOME_ENTITY_NAME,
  initialState: homeInitialState,
  reducers: {
  },
});

export const homeActions = homeSlice.actions;
export type HomeActionsType = typeof homeSlice.actions;

export const homeReducer = homeSlice.reducer;
