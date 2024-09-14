import { ThemeOptions } from '@mui/material/styles';
import {
  dialogOverrides,
  filledInputDefaults,
  filledInputSyleOverrides,
  listItemOverrides,
  listItemButtonOverrides,
  outlinedInputSyleOverrides,
  outlinedInputInputDefaults,
  themeColors,
} from './styles';
import { toolbarItemOverrides } from './styles/menus';

export const DRAWER_WIDTH = 300;

export const appTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: themeColors.primary,
    },
    secondary: {
      main: themeColors.secondary
    },
    error: {
      main: themeColors.error
    },
    info: {
      main: themeColors.info
    },
    success: {
      main: themeColors.success
    },
    warning: {
      main: themeColors.warning
    }
  },
  typography: {
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif, serif'
  },
  components: {
    MuiDialog: {
      styleOverrides: dialogOverrides
    },
    MuiFilledInput: {
      defaultProps: filledInputDefaults,
      styleOverrides: filledInputSyleOverrides
    },
    MuiListItem: {
      styleOverrides: listItemOverrides
    },
    MuiListItemButton: {
      styleOverrides: listItemButtonOverrides
    },
    MuiOutlinedInput: {
      defaultProps: outlinedInputInputDefaults,
      styleOverrides: outlinedInputSyleOverrides
    },
    MuiToolbar: {
      styleOverrides: toolbarItemOverrides
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
    //       width: DRAWER_WIDTH,
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
