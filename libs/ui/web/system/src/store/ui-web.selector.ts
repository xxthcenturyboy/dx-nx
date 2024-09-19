import { createSelector } from 'reselect';
import { PaletteMode } from '@mui/material';
import { Theme as ToastifyTheme } from 'react-toastify';

import { RootState } from '@dx/store-web';
import { MEDIA_BREAK } from '../ui.consts';
import { UiStateType } from '../ui-web.types';

const getThemePalette = (
  state: RootState
): RootState['ui']['theme']['palette'] => state.ui.theme.palette;

const selectUiState = (state: RootState): UiStateType => state.ui;
export const selectWindowHeight = (state: RootState): number =>
  state.ui.windowHeight;
export const selectWindowWidth = (state: RootState): number =>
  state.ui.windowWidth;

export const selectCurrentThemeMode = createSelector(
  [getThemePalette],
  (palette): PaletteMode | undefined => {
    return palette?.mode;
  }
);

export const selectIsMobileWidth = createSelector(
  [selectWindowWidth],
  (width): boolean => {
    return width <= MEDIA_BREAK.MOBILE;
  }
);

export const selectToastThemeMode = createSelector(
  [selectCurrentThemeMode],
  (mode): ToastifyTheme => {
    return mode || 'colored';
  }
);
