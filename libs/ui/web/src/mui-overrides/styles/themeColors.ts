import {
  amber,
  blue,
  blueGrey,
  brown,
  cyan,
  deepOrange,
  deepPurple,
  green,
  grey,
  indigo,
  lightBlue,
  lightGreen,
  lime,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from '@mui/material/colors';

export const APP_COLOR_PALETTE = {
  PRIMARY: blueGrey,
  SECONDARY: yellow,
  DARK: {
    PRIMARY: grey,
    SECONDARY: blueGrey
  },
  LIGHT: {
    BACKGROUND: grey
  }
};

export const themeColors = {
  // primary: '#09152F',
  // secondary: '#FCC711',
  primary: APP_COLOR_PALETTE.PRIMARY[900],
  secondary: APP_COLOR_PALETTE.SECONDARY[800],
  dark: {
    primary: APP_COLOR_PALETTE.DARK.PRIMARY[900],
    secondary: APP_COLOR_PALETTE.DARK.SECONDARY[800]
  },
  light: {
    background: APP_COLOR_PALETTE.LIGHT.BACKGROUND[100]
    // background: '#fbfbfb'
  }
};
