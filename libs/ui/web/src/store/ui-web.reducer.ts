import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1';

import { UiStateType } from './ui-web.types';
import { UI_WEB_ENTITY_NAME } from '../ui.consts';

export const uiInitialState: UiStateType = {
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
};

export const uiPersistConfig = {
  key: UI_WEB_ENTITY_NAME,
  storage,
  stateReconciler: autoMergeLevel1,
};

const uiSlice = createSlice({
  name: UI_WEB_ENTITY_NAME,
  initialState: uiInitialState,
  reducers: {
    windowSizeSet(state, action: PayloadAction<undefined>) {
      state.windowWidth = window && window.innerWidth,
      state.windowHeight = window && window.innerHeight
    }
  },
});

export const uiActions = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
