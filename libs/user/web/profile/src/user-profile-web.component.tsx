import React from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Fade,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import { logger } from '@dx/logger-web';
import {
  ConfirmationDialog,
  FADE_TIMEOUT_DUR,
  setDocumentTitle,
  uiActions
} from '@dx/ui-web';

import UserPhones from './UserPhones';
import UserEmails from './UserEmails';
import { selectProfileFormatted } from './user-profile-web.selectors';

export const UserProfile: React.FC = () => {
  const profile = useAppSelector((state: RootState) => selectProfileFormatted(state));
  const appMode = useAppSelector((state: RootState) => state.ui.theme.palette?.mode);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const mdBreak = useMediaQuery(theme.breakpoints.down('md'));

  React.useEffect(() => {
    setDocumentTitle('Profile');
  }, []);

  const toggleDarkMode = () => {
    if (appMode) {
      const nextMode = appMode === 'light' ? 'dark' : 'light';
      dispatch(uiActions.themeModeSet(nextMode));
    }
  };

  const handlePasswordReset = async (): Promise<void> => {
    const primaryEmail = profile?.emails.find(e => e.default);
    if (primaryEmail) {
      const confirmationMessage = `This will log you out and send a link to your email (${primaryEmail.email}) with which you can use to reset your password.`;
      try {
        dispatch(uiActions.appDialogSet(
          <ConfirmationDialog
            okText="OK"
            cancelText="Cancel"
            bodyMessage={confirmationMessage}
            noAwait={true}
            onComplete={
              async (isConfirmed: boolean) => {
                if (isConfirmed) {
                  // await dispatch(fetchRequestReset({
                  //   email: primaryEmail.email
                  // }));
                  // await dispatch(fetchLogout());
                  setTimeout(() => dispatch(uiActions.appDialogSet(null)), 1000);
                }

                if (!isConfirmed) {
                  dispatch(uiActions.appDialogSet(null));
                }
              }
            }
          />
        ));

      } catch (err) {
        logger.error(err);
      }
    }
  };

  return (
    <Fade in={true} timeout={FADE_TIMEOUT_DUR}>
      <Box>
        <Paper
          elevation={2}
        >
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            padding="20px"
          >
            <Grid item>
              <Typography
                variant="h5"
                color="primary"
              >
                Profile
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                size="small"
                onClick={handlePasswordReset}
              >
                Change Password
              </Button>
            </Grid>
          </Grid>
          <Divider />
          <Grid
            container
            justifyContent="flex-start"
            padding="20px"
            direction={mdBreak ? 'column' : 'row'}
          >
            <Grid
              container
              direction="column"
              width={mdBreak ? '100%' : '50%'}
              padding="10px"
            >
              <UserEmails emails={profile?.emails} />
              <UserPhones phones={profile?.phones} />
              <Grid
                item
                width={mdBreak ? '100%' : '50%'}
                padding="10px"
              >
                <Button
                  variant="outlined"
                  onClick={toggleDarkMode}
                >
                  Toggle Dark Mode
                </Button>
              </Grid>
            </Grid>

          </Grid>
        </Paper>
      </Box>
    </Fade>
  );
};
