import React from 'react';
import {
  Box,
  Button,
  Divider,
  Fade,
  Grid2,
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
import { ContentWrapper } from '@dx/ui-web-global-components';
import { uiActions } from '@dx/ui-web-system';
import { setDocumentTitle } from '@dx/utils-misc-web';
import { EmailList } from '@dx/email-web';
import { EmailType } from '@dx/email-shared';
import { PhoneType } from '@dx/phone-shared';
import { Phonelist } from '@dx/phone-web';
import { MediaDataType } from '@dx/media-shared';
import { userProfileActions } from './user-profile-web.reducer';
import { selectProfileFormatted } from './user-profile-web.selectors';
import { UserProfileChangePasswordDialog } from './user-profile-web-change-password.dialog';
import { UserProfileAvatar } from './user-profile-web-avatar.component';
import { UserProfileWebAvatarDialog } from './user-profile-web-avatar.dialog';

export const UserProfile: React.FC = () => {
  const profile = useAppSelector((state: RootState) =>
    selectProfileFormatted(state)
  );
  const appMode = useAppSelector(
    (state: RootState) => state.ui.theme.palette?.mode
  );
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const MD_BREAK = useMediaQuery(theme.breakpoints.down('md'));
  const SM_BREAK = useMediaQuery(theme.breakpoints.down('sm'));

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
    const primaryEmail = profile?.emails.find((e) => e.default);
    if (primaryEmail) {
      try {
        dispatch(
          uiActions.appDialogSet(
            <UserProfileChangePasswordDialog userId={profile.id} />
          )
        );
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

  const avatarDataCallback = (data: MediaDataType) => {
    dispatch(userProfileActions.profileImageUpdate(data.id));
  };

  return (
    <ContentWrapper
      headerTitle={`Profile: ${profile.username}`}
      contentMarginTop={SM_BREAK ? '98px' : '56px'}
      headerColumnRightJustification={SM_BREAK ? 'center' : 'flex-end'}
      headerColumnsBreaks={{
        left: {
          xs: 12,
          sm: 6,
        },
        right: {
          xs: 12,
          sm: 6,
        },
      }}
      headerContent={
        <Button
          variant="contained"
          size="small"
          onClick={handlePasswordReset}
          fullWidth={SM_BREAK ? true : false}
        >
          Change Password
        </Button>
      }
    >
      <Paper elevation={2}>
        <Grid2
          container
          justifyContent="flex-start"
          padding={SM_BREAK ? '16px' : '24px'}
        >
          <Grid2
            container
            direction={MD_BREAK ? 'column' : 'row'}
            justifyContent={'center'}
            size={12}
          >
            <Grid2
              size={12}
              justifyContent={'center'}
              alignItems={'center'}
              width={'100%'}
              paddingTop={'12px'}
            >
              <UserProfileAvatar
                fontSize="6rem"
                justifyContent="center"
                handleChangeImage={() =>
                  dispatch(
                    uiActions.appDialogSet(
                      <UserProfileWebAvatarDialog
                        avatarDataCallback={avatarDataCallback}
                      />
                    )
                  )
                }
                size={{
                  height: 142,
                  width: 142,
                }}
              />
            </Grid2>
          </Grid2>
          <Divider
            sx={{
              width: '100%',
              margin: '24px 0 0 0',
            }}
          />

          <Grid2
            container
            direction={MD_BREAK ? 'column' : 'row'}
            justifyContent={'center'}
            size={12}
          >
            <Grid2
              size={{
                sm: 12,
                lg: 6
              }}
              padding="10px"
              width={'100%'}
            >
              <EmailList
                emails={profile.emails}
                userId={profile.id}
                emailDataCallback={addEmailToProfile}
                emailDeleteCallback={removeEmailFromProfile}
              />
            </Grid2>
            <Grid2
              size={{
                sm: 12,
                lg: 6
              }}
              padding="10px"
              width={'100%'}
            >
              <Phonelist
                phones={profile.phones}
                userId={profile.id}
                phoneDataCallback={addPhoneToProfile}
                phoneDeleteCallback={removePhoneFromProfile}
              />
            </Grid2>
          </Grid2>

          <Divider
            sx={{
              width: '100%',
              margin: '12px 0 12px 0',
            }}
          />
          <Grid2
            container
            direction={MD_BREAK ? 'column' : 'row'}
            justifyContent={'flex-start'}
            size={12}
          >
            <Grid2
              width={MD_BREAK ? '100%' : '50%'}
              padding="10px"
            >
              <Button
                variant="outlined"
                onClick={toggleDarkMode}
              >
                Toggle Dark Mode
              </Button>
            </Grid2>
          </Grid2>
        </Grid2>
      </Paper>
    </ContentWrapper>
  );
};
