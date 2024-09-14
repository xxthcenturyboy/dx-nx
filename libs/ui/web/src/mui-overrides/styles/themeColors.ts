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
    PRIMARY: yellow,
    SECONDARY: blueGrey
  },
  LIGHT: {
    BACKGROUND: grey
  },
  BLUE: blue,
  BLUE_GREY: blueGrey,
  GREEN: green,
  INFO: lightBlue,
  ORANGE: orange,
  RED: red
};

export const themeColors = {
  // primary: '#09152F',
  // secondary: '#FCC711',
  primary: APP_COLOR_PALETTE.PRIMARY[900],
  secondary: APP_COLOR_PALETTE.SECONDARY[800],
  blueGrey: blueGrey[300],
  info: lightBlue[700],
  success: green[800],
  error: red[700],
  warning: orange[700],
  dark: {
    primary: APP_COLOR_PALETTE.DARK.PRIMARY[500],
    secondary: APP_COLOR_PALETTE.DARK.SECONDARY[500]
  },
  light: {
    background: APP_COLOR_PALETTE.LIGHT.BACKGROUND[100]
    // background: '#fbfbfb'
  },
  notificationHighlight: 'aliceblue'
};
