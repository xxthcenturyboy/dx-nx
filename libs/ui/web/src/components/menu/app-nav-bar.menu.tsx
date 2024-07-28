import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import { Button } from '@mui/material';
import {
  useLocation,
  useNavigate
} from 'react-router';
import styled from 'styled-components';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import { selectIsAuthenticated } from '@dx/auth-web';
import { APP_NAME } from '@dx/config-shared';
import { LogoutButton } from '@dx/auth-web';
import { WebConfigService } from '@dx/config-web';
import { uiActions } from '../../store/ui-web.reducer';
import { MEDIA_BREAK } from '../../ui.consts';

const Logo = styled.img`
  width: 36px;
`;

export const AppNavBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileBreak, setMobileBreak] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state: RootState) => selectIsAuthenticated(state));
  const windowWidth = useAppSelector((state: RootState) => state.ui.windowWidth) || 0;
  const logoUrl = useAppSelector((state: RootState) => state.ui.logoUrlSmall);
  const notificationCount = useAppSelector((state: RootState) => state.ui.notifications);
  const menuOpen = useAppSelector((state: RootState) => state.ui.menuOpen);
  // const themeMode = useAppSelector((state: RootState) => state.ui.theme.palette?.mode);
  const ROUTES = WebConfigService.getWebRoutes();

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

  const goToProfile = (): void => {
    navigate(ROUTES.USER_PROFILE.MAIN);
    handleCloseAccountMenu();
  };

  const goToLogin = (): void => {
    navigate(ROUTES.AUTH.LOGIN);
  };

  const handleClickAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAccountMenu = () => {
    setAnchorEl(null);
  };

  const hideLoginForRoutes = (): boolean => {
    return pathname.includes('/auth');
  };

  const renderAccountMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id="app-menu"
      keepMounted
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={Boolean(anchorEl)}
      onClose={handleCloseAccountMenu}
    >
      <MenuItem
        onClick={goToProfile}
      >
        Profile
      </MenuItem>
      <LogoutButton
        context="APP_BAR"
        onLocalClick={handleCloseAccountMenu}
      />
    </Menu>
  );

  return (
    <Box>
      <AppBar
        // color={themeMode === 'dark' ? 'default' : 'primary'}
        color="default"
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
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {APP_NAME}
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
                  size="large"
                  aria-label="show 17 new notifications"
                  color="inherit"
                >
                  <Badge badgeContent={notificationCount} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleClickAccountMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </>
            )
          }
          {
            (!isAuthenticated && !mobileBreak && !hideLoginForRoutes()) && (
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
      {renderAccountMenu}
    </Box>
  );
};
