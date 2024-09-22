import React from 'react';
import Typography from '@mui/material/Typography';
import { Grid2 } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import {
  RootState,
  useAppSelector
} from '@dx/store-web';
import {
  MEDIA_BREAK,
  themeColors
} from '@dx/ui-web-system';
import { LogoutButton } from '@dx/auth-web';
import { WebConfigService } from '@dx/config-web';
import { UserProfileAvatar } from '@dx/user-profile-web';
import {
  StyledAccountActionArea,
  StyledAccountList,
  StyledAccountMenuListItem,
  StyledAccountnMenu,
} from './app-menu-account.ui';

type AccountMenuPropsType = {
  anchorElement: HTMLElement | null;
  clickCloseMenu: () => void;
};

export const AccountMenu: React.FC<AccountMenuPropsType> = (props) => {
  const [mobileBreak, setMobileBreak] = React.useState(false);
  const windowWidth =
    useAppSelector((state: RootState) => state.ui.windowWidth) || 0;
  const ROUTES = WebConfigService.getWebRoutes();
  const navigate = useNavigate();

  React.useEffect(() => {
    setMobileBreak(windowWidth < MEDIA_BREAK.MOBILE);
  }, [windowWidth]);

  const goToProfile = (): void => {
    navigate(ROUTES.USER_PROFILE.MAIN);
    props.clickCloseMenu();
  };

  return (
    <StyledAccountnMenu
      anchorEl={props.anchorElement}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id="account-menu"
      keepMounted
      mobilebreak={mobileBreak.toString()}
      open={Boolean(props.anchorElement)}
      onClose={props.clickCloseMenu}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <StyledAccountActionArea>
        <Grid2
          container
          display="flex"
          direction="row"
          justifyContent="center"
          margin="12px"
          width="auto"
        >
          <Typography
            variant="body1"
            color={themeColors.primary}
            fontWeight={700}
          >
            Account Menu
          </Typography>
        </Grid2>
      </StyledAccountActionArea>
      <StyledAccountList>
        <StyledAccountMenuListItem onClick={goToProfile}>
          <Grid2
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
          >
            <Grid2 mr={2}>
              <UserProfileAvatar
                size={{
                  height: 24,
                  width: 24,
                }}
              />
            </Grid2>
            <Grid2>
              <Typography variant="body2">Profile</Typography>
            </Grid2>
          </Grid2>
        </StyledAccountMenuListItem>
        <LogoutButton context="APP_BAR" onLocalClick={props.clickCloseMenu} />
      </StyledAccountList>
    </StyledAccountnMenu>
  );
};
