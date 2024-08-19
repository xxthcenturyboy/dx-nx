import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1';
import { PersistConfig } from 'reduxjs-toolkit-persist/lib/types';

import {
  StatsApiHealthType,
  StatsStateType
} from './stats-web.types';
import { STATS_SUDO_WEB_ENTITY_NAME } from './stats-web.consts';

export const statsInitialState: StatsStateType = {
  api: undefined
};

export const statsPersistConfig: PersistConfig<StatsStateType> = {
  key: STATS_SUDO_WEB_ENTITY_NAME,
  blacklist: ['api'],
  storage,
  stateReconciler: autoMergeLevel1,
};

const statsSlice = createSlice({
  name: STATS_SUDO_WEB_ENTITY_NAME,
  initialState: statsInitialState,
  reducers: {
    setApiStats(state, action: PayloadAction<StatsApiHealthType | undefined>) {
      state.api = action.payload;
    }
  }
});

export const statsActions = statsSlice.actions;

export const statsReducer = statsSlice.reducer;
