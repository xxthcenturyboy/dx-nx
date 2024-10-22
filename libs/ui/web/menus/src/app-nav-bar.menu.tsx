import React from 'react';
import {
  AppBar,
  Badge,
  Box,
  Button,
  Icon,
  IconButton,
  Slide,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  AccountCircle,
  Menu,
  MenuOpen,
  Notifications,
} from '@mui/icons-material';
import {
  useLocation,
  useNavigate
} from 'react-router-dom';
import styled from 'styled-components';

import {
  useAppDispatch,
  useAppSelector
} from '@dx/utils-web-hooks';
import { selectIsAuthenticated } from '@dx/auth-web';
import { APP_NAME } from '@dx/config-shared';
import {
  loginBootstrap,
  WebConfigService
} from '@dx/config-web';
import { NotificationMenu } from '@dx/notifications-web';
import {
  selectNotificationCount,
  // useTestSocketsMutation
} from '@dx/notifications-web';
import { AccountMenu } from './app-menu-account.component';
import {
  MEDIA_BREAK,
  uiActions
} from '@dx/ui-web-system';

const Logo = styled.img`
  width: 36px;
`;

export const AppNavBar: React.FC = () => {
  const [anchorElementAccountMenu, setAnchorElementAccountMenu] =
    React.useState<null | HTMLElement>(null);
  const [anchorElementNotificationMenu, setAnchorElementNotificaitonMenu] =
    React.useState<null | HTMLElement>(null);
  const [mobileBreak, setMobileBreak] = React.useState(false);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(state =>
    selectIsAuthenticated(state)
  );
  const userProfile = useAppSelector(state => state.userProfile);
  // const userId = useAppSelector(state => state.userProfile.id);
  const windowWidth =
    useAppSelector(state => state.ui.windowWidth) || 0;
  const logoUrl = useAppSelector(state => state.ui.logoUrlSmall);
  const menuOpen = useAppSelector(state => state.ui.menuOpen);
  const themeMode = useAppSelector(
    state => state.ui.theme.palette?.mode
  );
  const notificationCount = useAppSelector(state =>
    selectNotificationCount(state)
  );
  const ROUTES = WebConfigService.getWebRoutes();
  // const [requestTestNotifications] = useTestSocketsMutation();

  React.useEffect(() => {
    if (isAuthenticated && userProfile) {
      loginBootstrap(userProfile, mobileBreak);
    }
  }, []);

  React.useEffect(() => {
    setMobileBreak(windowWidth < MEDIA_BREAK.MOBILE);
  }, [windowWidth]);

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

  const handleClickNotificationMenu = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorElementNotificaitonMenu(event.currentTarget);
  };

  const handleNotificationMenu = () => {
    setAnchorElementNotificaitonMenu(null);
  };

  const hideLoginForRoutes = (): boolean => {
    return pathname.includes(ROUTES.AUTH.LOGIN);
  };

  return (
    <Box>
      <AppBar
        color={themeMode === 'dark' ? 'default' : 'primary'}
        position="static"
        elevation={2}
        enableColorOnDark
        // style={
        //   {
        //     zIndex: 1200
        //   }
        // }
        sx={{
          width: '100%',
          position: 'fixed',
          '& .MuiAppBar': {
            root: {},
          },
          zIndex: 1200,
        }}
      >
        <Toolbar>
          {
            <Slide
              direction="right"
              in={isAuthenticated}
              mountOnEnter
              unmountOnExit
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 1 }}
                onClick={toggleMenuState}
              >
                {menuOpen ? (
                  <MenuOpen className="toolbar-icons" />
                ) : (
                  <Menu className="toolbar-icons" />
                )}
              </IconButton>
            </Slide>
          }
          <Icon
            color="inherit"
            aria-label="menu"
            sx={{
              display: 'flex',
              mr: 1,
              height: '1.75em',
              width: '1.75em',
              cursor: !isAuthenticated ? 'pointer' : 'initial',
            }}
            onClick={() => {
              if (!isAuthenticated) {
                navigate(ROUTES.MAIN);
              }
            }}
          >
            <Logo src={logoUrl} />
          </Icon>
          {!mobileBreak ? (
            <Typography
              variant="h6"
              component="div"
              className="toolbar-app-name"
              sx={{ flexGrow: 1 }}
            >
              {APP_NAME}
            </Typography>
          ) : (
            <div style={{ flexGrow: 1 }}>
              <span>&nbsp;</span>
            </div>
          )}
          <Slide
            direction="left"
            in={isAuthenticated}
            mountOnEnter
            unmountOnExit
          >
            <span>
              <IconButton
                className="toolbar-icons"
                size="large"
                aria-label="show notifications"
                aria-controls="notification-menu-appbar"
                aria-haspopup="true"
                onClick={handleClickNotificationMenu}
              >
                <Badge badgeContent={notificationCount} color="info">
                  <Notifications />
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
            </span>
          </Slide>
          {!isAuthenticated && !mobileBreak && !hideLoginForRoutes() && (
            <Button variant="contained" color="primary" onClick={goToLogin}>
              Login
            </Button>
          )}
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
