import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@dx/store-web';
import { logger } from '@dx/logger-web';
import { uiActions } from '@dx/ui-web-system';
import { StyledAccountMenuListItem } from '@dx/ui-web-menus';
import { ConfirmationDialog } from '@dx/ui-web-dialogs';
import { WebConfigService } from '@dx/config-web';
import { useLogoutMutation } from './auth-web.api';
import { authActions } from './auth-web.reducer';

type LogoutButtonType = {
  context: 'APP_MENU' | 'APP_BAR';
  onLocalClick?: () => any;
};

export const LogoutButton: React.FC<LogoutButtonType> = ({
  context,
  onLocalClick,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [requestLogout] = useLogoutMutation();
  const ROUTES = WebConfigService.getWebRoutes();

  const logout = async (): Promise<void> => {
    if (onLocalClick && typeof onLocalClick === 'function') {
      onLocalClick();
    }

    try {
      dispatch(
        uiActions.appDialogSet(
          <ConfirmationDialog
            okText="Log Out"
            cancelText="Cancel"
            // bodyMessage="Is it really time to go?"
            noAwait={true}
            onComplete={async (isConfirmed: boolean) => {
              if (isConfirmed) {
                try {
                  const logoutResponse = await requestLogout().unwrap();
                  if (logoutResponse.loggedOut) {
                    dispatch(authActions.tokenRemoved());
                    dispatch(authActions.setLogoutResponse(true));
                    // toast.success('Logged out.');
                    navigate(ROUTES.AUTH.LOGIN);
                    setTimeout(
                      () => dispatch(uiActions.appDialogSet(null)),
                      1000
                    );
                    return;
                  }
                  setTimeout(
                    () => dispatch(uiActions.appDialogSet(null)),
                    1000
                  );
                } catch (err) {
                  logger.error(err);
                  toast.warn('Could not complete the logout request.');
                }
              }

              if (!isConfirmed) {
                dispatch(uiActions.appDialogSet(null));
              }
            }}
          />
        )
      );
    } catch (err) {
      logger.error(err);
    }
  };

  if (context === 'APP_BAR') {
    return (
      <StyledAccountMenuListItem onClick={logout}>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
        >
          <Grid item mr={2}>
            <LogoutIcon />
          </Grid>
          <Grid item>
            <Typography variant="body2">Logout</Typography>
          </Grid>
        </Grid>
      </StyledAccountMenuListItem>
    );
  }

  if (context === 'APP_MENU') {
    return (
      <Button onClick={logout} endIcon={<LogoutIcon />}>
        Logout
      </Button>
    );
  }

  return <Button onClick={logout}>Logout</Button>;
};
