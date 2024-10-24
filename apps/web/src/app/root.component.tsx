import * as React from 'react';
import {
  Outlet,
  useLocation,
  useNavigate
} from 'react-router-dom';
import {
  createTheme,
  Theme,
  ThemeProvider
} from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Fade } from '@mui/material';
import {
  Slide,
  ToastContainer,
  Theme as ToastifyTheme
} from 'react-toastify';
import { injectStyle as injectToastifyStyle } from 'react-toastify/dist/inject-style';

import {
  useAppDispatch,
  useAppSelector
} from '@dx/utils-web-hooks';
import {
  appTheme,
  DRAWER_WIDTH,
  MEDIA_BREAK,
  STORAGE_KEYS,
  TOAST_LOCATION,
  TOAST_TIMEOUT,
  uiActions
} from '@dx/ui-web-system';
import { GlobalAwaiter } from '@dx/ui-web-global-components';
import {
  AppNavBar,
  MenuNav
} from '@dx/ui-web-menus';
import {
  CustomDialog,
  DialogApiError
  // DialogAwaiter
} from '@dx/ui-web-dialogs';
import { WebConfigService } from '@dx/config-web';
import { selectIsAuthenticated } from '@dx/auth-web';
import {
  userProfileActions,
  useLazyGetProfileQuery,
} from '@dx/user-profile-web';
import { appBootstrap } from '@dx/config-web';

export const Root: React.FC = () => {
  const [theme, setTheme] = React.useState<Theme>(createTheme());
  const [bootstrapped, setBootstrapped] = React.useState(false);
  const [menuBreak, setMenuBreak] = React.useState(false);
  const [mobileBreak, setMobileBreak] = React.useState(false);
  const [topPixel, setTopPixel] = React.useState(64);
  const [appFrameStyle, setAppFrameStyle] = React.useState<React.CSSProperties>(
    {
      zIndex: 1,
      height: '100vh',
    }
  );
  const [contentWrapperStyle, setContentWrapperStyle] =
    React.useState<React.CSSProperties>({});
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector(state => state.userProfile);
  const menuOpen = useAppSelector(state => state.ui.menuOpen);
  const themeOptions = useAppSelector(state => state.ui.theme);
  const isAuthenticated = useAppSelector(state => selectIsAuthenticated(state));
  const logoutResponse = useAppSelector(state => state.auth.logoutResponse);
  const windowWidth = useAppSelector(state => state.ui.windowWidth) || 0;
  // const toastTheme: ToastifyTheme = useAppSelector((state: RootState) => state.ui.theme.palette?.mode || 'color');
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const ROUTES = WebConfigService.getWebRoutes();
  const NO_REDICRET_ROUTES = WebConfigService.getNoRedirectRoutes();
  const canRedirect = !NO_REDICRET_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  const [
    fetchProfile,
    { data: profileResponse, isSuccess: fetchProfileSuccess },
  ] = useLazyGetProfileQuery();

  React.useEffect(() => {
    appBootstrap();

    dispatch(uiActions.windowSizeSet());
    window.addEventListener('resize', () => {
      dispatch(uiActions.windowSizeSet());
    });
    injectToastifyStyle();

    if (!userProfile && canRedirect) {
      void fetchProfile();
    }

    setTheme(createTheme(appTheme));
    updateAppThemeStyle();

    setTimeout(() => {
      setBootstrapped(true);
      dispatch(uiActions.bootstrapSet(true));
      // loginBootstrap();
    }, 200);
  }, []);

  React.useEffect(() => {
    if (logoutResponse) {
      dispatch(uiActions.toggleMenuSet(false));
      dispatch(userProfileActions.profileInvalidated());
      canRedirect && navigate(ROUTES.MAIN);
    }
  }, [logoutResponse]);

  React.useEffect(() => {
    if (
      fetchProfileSuccess &&
      profileResponse.profile &&
      typeof profileResponse.profile !== 'string'
    ) {
      dispatch(userProfileActions.profileUpdated(profileResponse.profile));
    }
  }, [fetchProfileSuccess]);

  React.useEffect(() => {
    if (bootstrapped) {
      setTheme(createTheme(themeOptions));
      localStorage.setItem(
        STORAGE_KEYS.THEME_MODE,
        themeOptions.palette?.mode || 'light'
      );
    }
  }, [themeOptions]);

  React.useEffect(() => {
    updateAppThemeStyle();
    updateContentWrapperStyles();
  }, [theme]);

  React.useEffect(() => {
    if (bootstrapped) {
      updateContentWrapperStyles();
      if (isAuthenticated) {
        localStorage.setItem(
          STORAGE_KEYS.MENU_STATE,
          menuOpen ? 'OPEN' : 'CLOSED'
        );
      }
    }
  }, [menuOpen]);

  React.useEffect(() => {
    mobileBreak ? setTopPixel(60) : setTopPixel(64);
  }, [mobileBreak]);

  React.useEffect(() => {
    if (bootstrapped) {
      updateContentWrapperStyles();
    }
  }, [menuBreak, topPixel]);

  React.useEffect(() => {
    setMenuBreak(windowWidth < MEDIA_BREAK.MENU);
    setMobileBreak(windowWidth < MEDIA_BREAK.MOBILE);
  }, [windowWidth]);

  const updateAppThemeStyle = (): void => {
    setAppFrameStyle({
      ...appFrameStyle,
      backgroundColor:
        theme.palette.mode === 'dark'
          ? theme.palette.background.default
          : '#fbfbfb',
    });
  };

  const getContentWrapperStyles = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      // padding: theme.spacing(3),
      // paddingBottom: theme.spacing(3),
      overflow: 'auto',
      position: 'relative',
      top: `${topPixel}px`,
      height: `calc(100vh - ${topPixel}px)`, // Subtract width of header
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    };

    let openStyles: React.CSSProperties = {};

    if (menuOpen && !menuBreak) {
      openStyles = {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: `${DRAWER_WIDTH}px`,
      };
    }

    return {
      ...baseStyle,
      ...openStyles,
    };
  };

  const updateContentWrapperStyles = (): void => {
    const styles = getContentWrapperStyles();
    setContentWrapperStyle(styles);
  };

  return (
    <ThemeProvider theme={theme}>
      <Fade in={true} timeout={2000}>
        <Box flexGrow={1} style={appFrameStyle}>
          {isAuthenticated && <MenuNav />}
          <AppNavBar />
          <Box style={contentWrapperStyle}>
            <Outlet />
          </Box>
        </Box>
      </Fade>
      <CustomDialog />
      <DialogApiError />
      <GlobalAwaiter />
      <ToastContainer
        position={TOAST_LOCATION}
        autoClose={TOAST_TIMEOUT}
        closeOnClick
        transition={Slide}
        theme={'colored'}
      />
    </ThemeProvider>
  );
};
