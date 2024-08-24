import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import { Button } from '@mui/material';
import {
  useLocation,
  useNavigate
} from 'react-router-dom';
import styled from 'styled-components';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import { selectIsAuthenticated } from '@dx/auth-web';
import { APP_NAME } from '@dx/config-shared';
import { WebConfigService } from '@dx/config-web';
import { NotificationMenu } from '@dx/notifications-web';
import {
  notificationActions,
  selectNotificationCount,
  useLazyGetNotificationsQuery
} from '@dx/notifications-web';
import { AccountMenu } from './app-menu-account.component';
import { uiActions } from '../../store/ui-web.reducer';
import { MEDIA_BREAK } from '../../ui.consts';

const Logo = styled.img`
  width: 36px;
`;

export const AppNavBar: React.FC = () => {
  const [anchorElementAccountMenu, setAnchorElementAccountMenu] = React.useState<null | HTMLElement>(null);
  const [anchorElementNotificationMenu, setAnchorElementNotificaitonMenu] = React.useState<null | HTMLElement>(null);
  const [mobileBreak, setMobileBreak] = React.useState(false);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state: RootState) => selectIsAuthenticated(state));
  const userId = useAppSelector((state: RootState) => state.userProfile.id);
  const windowWidth = useAppSelector((state: RootState) => state.ui.windowWidth) || 0;
  const logoUrl = useAppSelector((state: RootState) => state.ui.logoUrlSmall);
  const menuOpen = useAppSelector((state: RootState) => state.ui.menuOpen);
  const themeMode = useAppSelector((state: RootState) => state.ui.theme.palette?.mode);
  const notificationCount = useAppSelector((state: RootState) => selectNotificationCount(state));
  const ROUTES = WebConfigService.getWebRoutes();
  const [
    fetchNotifications,
    {
      data: notificationsResponse,
      error: notificationsError,
      isFetching: isLoadingNotifications,
      isSuccess: fetchNotificationsSuccess,
      isUninitialized: fetchNotificationsUninitialized
    }
  ] = useLazyGetNotificationsQuery();

  React.useEffect(() => {
    if (
      isAuthenticated
      && userId
      && !isLoadingNotifications
    ) {
      void fetchNotifications({ userId });
    }
  }, []);

  React.useEffect(() => {
    setMobileBreak(windowWidth < MEDIA_BREAK.MOBILE);
  }, [windowWidth]);

  React.useEffect(() => {
    if (
      isAuthenticated
      && userId
      && !isLoadingNotifications
    ) {
      void fetchNotifications({ userId });
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (
      !isLoadingNotifications
    ) {
      if (!notificationsError) {
        dispatch(notificationActions.setNotifications(notificationsResponse|| []));
      }
      if (
        notificationsError
      ) {
        'error' in notificationsError && dispatch(uiActions.apiDialogSet(notificationsError['error']));
      }
    }
  }, [isLoadingNotifications]);

  const toggleMenuState = (): void => {
    if (isAuthenticated) {
      dispatch(uiActions.toggleMenuSet(!menuOpen));
      return;
    }

    navigate(ROUTES.MAIN);
  };

  const goToLogin = (): void => {
    navigate(ROUTES.AUTH.LOGIN);
  };

  const handleClickAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElementAccountMenu(event.currentTarget);
  };

  const handleCloseAccountMenu = () => {
    setAnchorElementAccountMenu(null);
  };

  const handleClickNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElementNotificaitonMenu(event.currentTarget);
  };

  const handleNotificationMenu = () => {
    setAnchorElementNotificaitonMenu(null);
  };

  const hideLoginForRoutes = (): boolean => {
    return pathname.includes(ROUTES.AUTH.MAIN);
  };

  return (
    <Box>
      <AppBar
        color={themeMode === 'dark' ? 'default' : 'primary'}
        position="static"
        elevation={2}
        enableColorOnDark
        style={{
          zIndex: 1200
        }}
        sx={{
          width: '100%',
          position: 'fixed',
          '& .MuiAppBar': {
            root:  {
            }
          },
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleMenuState}
          >
            <Logo src={logoUrl} />
          </IconButton>
          {
            !mobileBreak ? (
              <Typography
                variant="h6"
                component="div"
                className="toolbar-app-name"
                sx={
                  { flexGrow: 1 }
                }
              >
                { APP_NAME }
              </Typography>
            )
            :
            (
              <div style={{ flexGrow: 1 }}><span>&nbsp;</span></div>
            )
          }
          {
            isAuthenticated && (
              <>
                <IconButton
                  className="toolbar-icons"
                  size="large"
                  aria-label="show notifications"
                  aria-controls="notification-menu-appbar"
                  aria-haspopup="true"
                  onClick={handleClickNotificationMenu}
                >
                  <Badge
                    badgeContent={notificationCount}
                    color="info"
                  >
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="account menu for current user"
                  aria-controls="account-menu-appbar"
                  aria-haspopup="true"
                  onClick={handleClickAccountMenu}
                  className="toolbar-icons"
                >
                  <AccountCircle />
                </IconButton>
              </>
            )
          }
          {
            (
              !isAuthenticated &&
              !mobileBreak
              && !hideLoginForRoutes()
            ) && (
              <>
                <Button
                  variant="text"
                  onClick={goToLogin}
                >
                  Login
                </Button>
              </>
            )
          }
        </Toolbar>
      </AppBar>
      <AccountMenu
        anchorElement={anchorElementAccountMenu}
        clickCloseMenu={handleCloseAccountMenu}
      />
      <NotificationMenu
        anchorElement={anchorElementNotificationMenu}
        clickCloseMenu={handleNotificationMenu}
      />
    </Box>
  );
};
