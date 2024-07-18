import { createSelector } from 'reselect';

import { UiStateType } from './ui-web.types';
import { RootState } from '@dx/store-web';

const selectUiState = (state: RootState): UiStateType =>
  state.ui;
export const selectWindowHeight = (state: RootState): number =>
  state.ui.windowHeight;
export const selectWindowWidth = (state: RootState): number =>
  state.ui.windowWidth;
