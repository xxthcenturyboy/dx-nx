import React from 'react';
import { RootState, useDispatch, useSelector } from 'client/store';
import { push } from 'connected-react-router';
import { routes as UserProfileRoutes } from 'client/UserProfile';
import { actions as appActions } from 'client/App';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { APP_NAME } from 'shared/constants';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import { MEDIA_BREAK } from 'client/core/constants';
import styled from 'styled-components';
import { selectIsAuthenticated } from 'client/UserProfile/selectors';
import { LogoutContext } from 'client/App/enums';
import { LogoutButton } from 'client/App/components/LogoutButton';
import allRoutes from 'client/routes';
import { Button } from '@mui/material';
import { useLocation } from 'react-router';

const Logo = styled.img`
  width: 36px;
`;

export const AppNavBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileBreak, setMobileBreak] = React.useState<boolean>(false);
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const isAuthenticated = useSelector((state: RootState) => selectIsAuthenticated(state));
  const windowWidth = useSelector((state: RootState) => state.client.windowWidth) || 0;
  const logoUrl = useSelector((state: RootState) => state.app.logoUrlSmall);
  const notificationCount = useSelector((state: RootState) => state.app.notifications);
  const menuOpen = useSelector((state: RootState) => state.app.menuOpen);
  // const themeMode = useSelector((state: RootState) => state.app.settings.themeOptions.palette?.mode);

  React.useEffect(() => {
    setMobileBreak(windowWidth < MEDIA_BREAK.MOBILE);
  }, [windowWidth]);

  const toggleMenuState = (): void => {
    if (isAuthenticated) {
      dispatch(appActions.toggleMenu(!menuOpen));
      return;
    }

    dispatch(push(allRoutes.main));
  };

  const goToProfile = (): void => {
    dispatch(push(UserProfileRoutes.main));
    handleCloseAccountMenu();
  };

  const goToLogin = (): void => {
    dispatch(push(allRoutes.login));
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
      <MenuItem onClick={goToProfile}>Profile</MenuItem>
      <LogoutButton context={LogoutContext.APP_BAR} onLocalClick={handleCloseAccountMenu} />
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
