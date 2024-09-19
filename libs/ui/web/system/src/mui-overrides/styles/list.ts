import { BORDER_RADIUS, BOX_SHADOW } from './common';
import { yellow } from '@mui/material/colors';

export const listItemOverrides = {
  root: {
    '&&.menu-item': {
      borderRadius: BORDER_RADIUS,
      boxShadow: BOX_SHADOW,
      margin: '10px 0',
    },
    '&&.privilegeset-item': {
      borderRadius: BORDER_RADIUS,
      boxShadow: BOX_SHADOW,
      margin: '10px 0',
    },
  },
};

export const listItemButtonOverrides = {
  root: {
    '&&.menu-item': {
      borderRadius: BORDER_RADIUS,
      boxShadow: BOX_SHADOW,
      margin: '10px 0',
    },
    '&&.privilegeset-item': {
      borderRadius: BORDER_RADIUS,
      boxShadow: BOX_SHADOW,
      margin: '10px 0',
    },
    '&&.Mui-selected': {
      backgroundColor: yellow[200],
    },
  },
};
