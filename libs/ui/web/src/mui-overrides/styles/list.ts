import {
  borderRadius,
  boxShadow
} from './common';
import { yellow } from '@mui/material/colors';

export const listItemOverrides = {
  root: {
    '&&.menu-item': {
      borderRadius,
      boxShadow,
      margin: '10px 0',
    },
    '&&.privilegeset-item': {
      borderRadius,
      boxShadow,
      margin: '10px 0',
    }
  }
};

export const listItemButtonOverrides = {
  root: {
    '&&.menu-item': {
      borderRadius,
      boxShadow,
      margin: '10px 0',
    },
    '&&.privilegeset-item': {
      borderRadius,
      boxShadow,
      margin: '10px 0',
    },
    '&&.Mui-selected': {
      backgroundColor: yellow[200]
    }
  }
};
