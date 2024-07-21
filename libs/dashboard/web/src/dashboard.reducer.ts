import { createSlice } from '@reduxjs/toolkit';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1';

import { DashboardStateType } from './dashboard.types';
import { DASHBOARD_ENTITY_NAME } from './dashboard.consts';

export const dashbaordInitialState: DashboardStateType = {
  a: null
};

export const dashboardPersistConfig = {
  key: DASHBOARD_ENTITY_NAME,
  // blacklist: ['password', 'passwordConfirmation'],
  storage,
  stateReconciler: autoMergeLevel1,
};

const dashboardSlice = createSlice({
  name: DASHBOARD_ENTITY_NAME,
  initialState: dashbaordInitialState,
  reducers: {
  },
});

export const dashboardActions = dashboardSlice.actions;
export type DashboardActionsType = typeof dashboardSlice.actions;

export const dashboardReducer = dashboardSlice.reducer;
