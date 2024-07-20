import {
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';
import storage from 'reduxjs-toolkit-persist/lib/storage';
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1';
import { PersistConfig } from 'reduxjs-toolkit-persist/lib/types';
import { PaletteMode } from '@mui/material';

import { UiStateType } from './ui-web.types';
import { UI_WEB_ENTITY_NAME } from '../ui.consts';
import {
  // API_HOST_PORT,
  // API_URL,
  APP_NAME
} from '@dx/config-shared';
import { appTheme } from '../muiOverrides/muiTheme';

export const uiInitialState: UiStateType = {
  apiDialogError: null,
  apiDialogOpen: false,
  awaitDialogMessage: '',
  awaitDialogOpen: false,
  bootstrapped: false,
  dialogComponent: null,
  dialogOpen: false,
  isShowingUnauthorizedAlert: false,
  logoUrl: `/img/logo-2.png`,
  logoUrlSmall: `/img/logo-square-2.png`,
  menuOpen: false,
  name: APP_NAME,
  notifications: 0,
  routes: {},
  theme: appTheme,
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
};

export const uiPersistConfig: PersistConfig<UiStateType> = {
  key: 'app',
  blacklist: [
    'apiDialogError',
    'apiDialogOpen',
    'awaitDialogMessage',
    'awaitDialogOpen',
    'bootstrapped',
    'dialogOpen',
    'dialogComponent',
    'isShowingUnauthorizedAlert'
  ],
  storage,
  stateReconciler: autoMergeLevel1,
};

const uiSlice = createSlice({
  name: UI_WEB_ENTITY_NAME,
  initialState: uiInitialState,
  reducers: {
    appDialogSet(state, action: PayloadAction<string>) {
      state.apiDialogOpen = !!action.payload;
      state.apiDialogError = action.payload;
    },
    apiDialogSet(state, action: PayloadAction<string>) {
      state.apiDialogOpen = !!action.payload;
      state.apiDialogError = action.payload;
    },
    awaitDialogMessageSet(state, action: PayloadAction<string>) {
      state.awaitDialogMessage = action.payload;
    },
    awaitDialogOpenSet(state, action: PayloadAction<boolean>) {
      state.apiDialogOpen = action.payload;
    },
    bootstrapSet(state, action: PayloadAction<boolean>) {
      state.bootstrapped = action.payload;
    },
    themeModeSet(state, action: PayloadAction<PaletteMode>) {
      if (
        state.theme.palette
        && action.payload
      ) {
        state.theme.palette.mode = action.payload;
      }
    },
    toggleMenuSet(state, action: PayloadAction<boolean>) {
      state.menuOpen = action.payload;
    },
    windowSizeSet(state, action: PayloadAction<undefined>) {
      state.windowWidth = window && window.innerWidth,
      state.windowHeight = window && window.innerHeight
    }
  },
});

export const uiActions = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
