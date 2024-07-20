import {
  borderRadius,
  boxShadow
} from './common';

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
    }
  }
};
