import * as React from 'react';
import {
  RootState,
  useDispatch,
  useSelector
} from 'client/store';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { createTheme, Theme, ThemeProvider } from '@mui/material/styles';
import fetchProfile from 'client/UserProfile/actions/fetchProfile';
import { AppNavBar } from 'client/App/components/AppNavBar';
import { appBootstrap, loginBootstrap } from 'client/core/bootstrap';
import Box from '@mui/material/Box';
import { Fade } from '@mui/material';
import { PrivateRoute } from 'client/core/PrivateRoute';
import { AppRouter } from 'client/core/Router';
import { AuthRouter } from 'client/Auth/components/Router';
import { MenuNav } from 'client/App/components/Menu';
import { drawerWidth } from 'client/core/UI/mui-overrides/muiTheme';
import { selectIsAuthenticated } from 'client/UserProfile/selectors';
import { actions as appActions } from 'client/App';
import { allRoutes, noRedirectRoutes } from 'client/routes';
import { AppUrlEntities, OpenClosed, StorageKeys } from 'client/core/enums';
import { actions as userProfileActions } from 'client/UserProfile';
import { push } from 'connected-react-router';
import { MEDIA_BREAK, TOAST_LOCATION, TOAST_TIMEOUT } from 'client/core/constants';
import { CustomDialog } from 'client/core/UI/components/Dialog/Dialog';
import { DialogApiError } from 'client/core/UI/components/Dialog/DialogApiError';
// import { DialogAwaiter } from 'client/core/UI/components/Dialog/DialogAwaiter';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { selectToastThemeMode } from 'client/App/selectors';
import { Home } from 'client/DMZ/Home/components/Home';
// import Loading from 'client/core/UI/components/Loading';
import GlobalAwaiter from './GlobalAwaiter';
import { ShortlinkComponent } from 'client/Shortlink/components/short-link.component';

// Code splitting
import {
  Login,
  NotFound,
} from 'client/core/LazyLoader';

const App: React.FC = () => {
  const [theme, setTheme] = React.useState<Theme>(createTheme());
  const [bootstrapped, setBootstrapped] = React.useState<boolean>(false);
  const [menuBreak, setMenuBreak] = React.useState<boolean>(false);
  const [mobileBreak, setMobileBreak] = React.useState<boolean>(false);
  const [topPixel, setTopPixel] = React.useState<number>(64);
  const [appFrameStyle, setAppFrameStyle] = React.useState<React.CSSProperties>({
    zIndex: 1,
    height: '100vh'
  });
  const [contentWrapperStyle, setContentWrapperStyle] = React.useState<React.CSSProperties>({});
  const dispatch = useDispatch();
  const userProfile = useSelector((state: RootState) => state.userProfile.profile);
  const menuOpen = useSelector((state: RootState) => state.app.menuOpen);
  const themeOptions = useSelector((state: RootState) => state.app.settings.themeOptions);
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
  const logoutResponse = useSelector((state: RootState) => state.auth.logoutResponse);
  const windowWidth = useSelector((state: RootState) => state.client.windowWidth) || 0;
  const toastTheme = useSelector((state: RootState) => selectToastThemeMode(state));
  const location = useLocation();
  const canRedirect = !noRedirectRoutes.some(route => location.pathname.startsWith(route));

  React.useEffect(() => {
    if (!userProfile && canRedirect) {
      void dispatch(fetchProfile());
    }

    appBootstrap();
    setTheme(createTheme(themeOptions));
    updateAppThemeStyle();

    setTimeout(() => {
      setBootstrapped(true);
      dispatch(appActions.setBootstrapped());
      loginBootstrap();
    }, 200);
  }, []);

  React.useEffect(() => {
    if (logoutResponse) {
      dispatch(appActions.toggleMenu(false));
      dispatch(userProfileActions.setProfile(null));
      dispatch(userProfileActions.invalidateProfile());
      canRedirect && dispatch(push(allRoutes.main));
    }
  }, [logoutResponse]);

  React.useEffect(() => {
    if (bootstrapped) {
      setTheme(createTheme(themeOptions));
      localStorage.setItem(StorageKeys.THEME_MODE, themeOptions.palette?.mode || 'light');
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
        localStorage.setItem(StorageKeys.MENU_STATE, menuOpen ? OpenClosed.OPEN : OpenClosed.CLOSED);
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
      backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#fbfbfb',
    });
  };

  const getContentWrapperStyles = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      padding: theme.spacing(3),
      overflow: 'auto',
      position: 'relative',
      top: `${topPixel}px`,
      // height: `calc(100% - ${topPixel}px)`, // Subtract width of header
      flexGrow: 1,
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    };

    let openStyles: React.CSSProperties = {};

    if (menuOpen && !menuBreak) {
      openStyles = {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: `${drawerWidth}px`,
      };
    }

    return {
      ...baseStyle,
      ...openStyles
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
          {
            isAuthenticated && (
              <MenuNav />
            )
          }
          <AppNavBar />
          <Box style={contentWrapperStyle}>
            <Switch>
              <Route exact path={allRoutes.main} component={Home} />
              <Route exact path={allRoutes.login} component={Login} />
              <Route path={`${allRoutes.auth.main}/*`} component={AuthRouter} />
              <Route exact path={`${allRoutes.shortlink.main}/:token`} component={ShortlinkComponent} />
              <PrivateRoute path={`/*`} component={AppRouter} />
              <Route exact path="/404" component={NotFound} />
              <Redirect from="*" to="/404" />
            </Switch>
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
        theme={toastTheme}
      />
    </ThemeProvider>
  );
};

export default App;
