import { createSelector } from 'reselect';
import { PaletteMode } from '@mui/material';
import { Theme as ToastifyTheme } from 'react-toastify';

import { UiStateType } from './ui-web.types';
import { RootState } from '@dx/store-web';

const getThemePalette = (state: RootState): RootState['ui']['theme']['palette'] => state.ui.theme.palette;

const selectUiState = (state: RootState): UiStateType => state.ui;
export const selectWindowHeight = (state: RootState): number => state.ui.windowHeight;
export const selectWindowWidth = (state: RootState): number => state.ui.windowWidth;

export const selectCurrentThemeMode = createSelector(
  [getThemePalette],
  (palette): PaletteMode | undefined => {
    return palette?.mode;
  }
);

export const selectToastThemeMode = createSelector(
  [selectCurrentThemeMode],
  (mode): ToastifyTheme => {
    return mode || 'colored';
  }
);
