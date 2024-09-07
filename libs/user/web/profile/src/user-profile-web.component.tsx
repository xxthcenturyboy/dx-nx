import React from 'react';
import {
  Box,
  Button,
  Divider,
  Fade,
  Grid,
  Paper,
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
  uiActions
} from '@dx/ui-web';
import { setDocumentTitle } from '@dx/utils-misc-web';
import { EmailList } from '@dx/email-web';
import { EmailType } from '@dx/email-shared';
import { PhoneType } from '@dx/phone-shared';
import { Phonelist } from '@dx/phone-web';
import { userProfileActions } from './user-profile-web.reducer';
import { selectProfileFormatted } from './user-profile-web.selectors';
import { UserProfileChangePasswordDialog } from './user-profile-web-change-password.dialog';
import { UserProfileAvatar } from './user-profile-web-avatar.component';

export const UserProfile: React.FC = () => {
  const profile = useAppSelector((state: RootState) => selectProfileFormatted(state));
  const appMode = useAppSelector((state: RootState) => state.ui.theme.palette?.mode);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const lgBreak = useMediaQuery(theme.breakpoints.down('lg'));
  const mdBreak = useMediaQuery(theme.breakpoints.down('md'));
  const smBreak = useMediaQuery(theme.breakpoints.down('sm'));

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
      try {
        dispatch(uiActions.appDialogSet(
          <UserProfileChangePasswordDialog
            userId={profile.id}
          />
        ));

      } catch (err) {
        logger.error(err);
      }
    }
  };

  const addEmailToProfile = (email: EmailType) => {
    dispatch(userProfileActions.emailAddedToProfile(email));
  };

  const removeEmailFromProfile = (email: EmailType) => {
    dispatch(userProfileActions.emailRemovedFromProfile(email.id));
  };

  const addPhoneToProfile = (phone: PhoneType) => {
    dispatch(userProfileActions.phoneAddedToProfile(phone));
  };

  const removePhoneFromProfile = (phone: PhoneType) => {
    dispatch(userProfileActions.phoneRemovedFromProfile(phone.id));
  };

  return (
    <Fade
      in={true}
      timeout={FADE_TIMEOUT_DUR}
    >
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
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
            >
              <Typography
                variant="h5"
                color="primary"
              >
                Profile: { profile.username }
              </Typography>
            </Grid>
            <Grid
              item
              display="flex"
              xs={12}
              sm={6}
              md={6}
              justifyContent={smBreak ? 'center' : 'flex-end'}
            >
              <Button
                variant="contained"
                size="small"
                onClick={handlePasswordReset}
                fullWidth={smBreak ? true : false}
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
          >
            <Grid
              container
              direction={mdBreak ? 'column' : 'row'}
              justifyContent={'center'}
            >
              <Grid
                item
                xs={12}
                justifyContent={'center'}
                alignItems={'center'}
                width={'100%'}
              >
                <UserProfileAvatar
                  fontSize='6rem'
                  justifyContent="center"
                  handleChangeImage={
                    () => console.log('click')
                  }
                  size={
                    {
                      height: 142,
                      width: 142
                    }
                  }
                />
              </Grid>
            </Grid>
            <Divider
              sx={
                {
                  width: '100%',
                  margin: '24px 0 0 0'
                }
              }
            />

            <Grid
              container
              direction={mdBreak ? 'column' : 'row'}
              justifyContent={'center'}
              // width={'100%'}
            >
              <Grid
                item
                md={12}
                lg={6}
                padding="10px"
                width={'100%'}
              >
                <EmailList
                  emails={profile.emails}
                  userId={profile.id}
                  emailDataCallback={addEmailToProfile}
                  emailDeleteCallback={removeEmailFromProfile}
                />
              </Grid>
              <Grid
                item
                md={12}
                lg={6}
                padding="10px"
                width={'100%'}
              >
                <Phonelist
                  phones={profile.phones}
                  userId={profile.id}
                  phoneDataCallback={addPhoneToProfile}
                  phoneDeleteCallback={removePhoneFromProfile}
                />
              </Grid>
            </Grid>

            <Grid
              container
              direction={mdBreak ? 'column' : 'row'}
              justifyContent={'flex-start'}
            >
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
