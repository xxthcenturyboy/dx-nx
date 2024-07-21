import { createSlice } from '@reduxjs/toolkit';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1';

import { ShortlinkStateType } from './shortlink.types';
import { SHORTLINK_ENTITY_NAME } from './shortlink.consts';

export const shortlinkInitialState: ShortlinkStateType = {
  fetchedRoute: '',
  isFetchingShortlink: false,
  fetchShortlinkError: '',
};

export const shortlinkPersistConfig = {
  key: SHORTLINK_ENTITY_NAME,
  blacklist: ['isFetchingShortlink', 'fetchShortlinkError', 'fetchedRoute'],
  storage,
  stateReconciler: autoMergeLevel1,
};

const shortlinkSlice = createSlice({
  name: SHORTLINK_ENTITY_NAME,
  initialState: shortlinkInitialState,
  reducers: {

  },
});

export const shortlinkActions = shortlinkSlice.actions;
export type ShortlinkActionsType = typeof shortlinkSlice.actions;

export const shortlinkReducer = shortlinkSlice.reducer;
