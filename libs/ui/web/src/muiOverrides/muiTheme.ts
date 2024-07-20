import { ThemeOptions } from '@mui/material/styles';
import {
  dialogOverrides,
  listItemOverrides,
  listItemButtonOverrides,
  themeColors,
} from './styles';
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

export const drawerWidth = 300;

export const appTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: themeColors.primary
    },
    secondary: {
      main: themeColors.secondary
    },
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif, serif'
  },
  components: {
    MuiDialog: {
      styleOverrides: dialogOverrides
    },
    MuiListItem: {
      styleOverrides: listItemOverrides
    },
    MuiListItemButton: {
      styleOverrides: listItemButtonOverrides
    }
  }
  // components: {
  //   MuiAppBar: {
  //     defaultProps: {
  //       enableColorOnDark: false
  //     }
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: themeColors.primary
    //     }
    //   }
    // },
    // MuiDrawer: {
    //   styleOverrides: {
    //     paper: {
    //       position: 'fixed',
    //       width: drawerWidth,
    //       borderRadius: 0,
    //       borderTop: 'none',
    //       borderBottom: 'none',
    //       top: '64px',
    //       height: `calc(100% - 64px)`
    //     },
    //   }
    // }
  // }
};
