import React, { ReactElement } from 'react';
import { BeatLoader } from 'react-spinners';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import {
  useAppDispatch,
  useAppSelector
} from '@dx/utils-web-hooks';
import { logger } from '@dx/logger-web';
import { UpdatePasswordPayloadType } from '@dx/user-shared';
import {
  selectIsMobileWidth,
  themeColors,
  uiActions,
} from '@dx/ui-web-system';
import { SuccessLottie } from '@dx/ui-web-lottie';
import {
  CustomDialogContent,
  DialogError,
  DialogWrapper
} from '@dx/ui-web-dialogs';
import { ChangePasswordForm } from './user-profile-web-change-password.ui';
import { useUpdatePasswordMutation } from './user-profile-web.api';
import { useCheckPasswordStrengthMutation } from '@dx/auth-web';
import { AuthWebRequestOtpEntry } from '@dx/auth-web';

type UserProfileChangePasswordPropsType = {
  userId: string;
};

export const UserProfileChangePasswordDialog: React.FC<
  UserProfileChangePasswordPropsType
> = (props): ReactElement => {
  const [allSucceeded, setAllSucceeded] = React.useState(false);
  const [showLottieError, setShowLottieError] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isPasswordStrong, setIsPasswordStrong] = React.useState(false);
  const [passwordStrengthMessage, setPasswordStrengthMessage] =
    React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const isMobileWidth = useAppSelector(state => selectIsMobileWidth(state));
  const theme = useTheme();
  const SM_BREAK = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useAppDispatch();
  const [
    requestPasswordStrength,
    {
      data: checkStrengthResponse,
      error: checkStrengthError,
      isLoading: isLoadingCheckStrength,
      isSuccess: checkStrengthSuccess,
      isUninitialized: checkStrengthUninitialized,
    },
  ] = useCheckPasswordStrengthMutation();
  const [
    requestUpdatePassword,
    {
      data: updatePasswordResponse,
      error: updatePasswordlError,
      isLoading: isLoadingUpdatePassword,
      isSuccess: updatePasswordSuccess,
      isUninitialized: updatePasswordUninitialized,
    },
  ] = useUpdatePasswordMutation();

  React.useEffect(() => {
    if (!props.userId) {
      handleClose();
    }
  }, []);

  React.useEffect(() => {
    if (!isLoadingUpdatePassword && !updatePasswordUninitialized) {
      if (!updatePasswordlError) {
        setShowLottieError(false);
        setAllSucceeded(true);
      } else {
        if ('error' in updatePasswordlError) {
          setErrorMessage(updatePasswordlError['error']);
        }
        setShowLottieError(true);
      }
    }
  }, [isLoadingUpdatePassword]);

  React.useEffect(() => {
    if (!isLoadingCheckStrength && !checkStrengthUninitialized) {
      if (!checkStrengthError) {
        setShowLottieError(false);
        if (checkStrengthResponse.score >= 3) {
          setIsPasswordStrong(true);
        }
        if (checkStrengthResponse.score < 3) {
          setIsPasswordStrong(false);
          setPasswordStrengthMessage(
            `${checkStrengthResponse.feedback.warning} ${checkStrengthResponse.feedback.suggestions}`
          );
        }
      } else {
        if ('error' in checkStrengthError) {
          setErrorMessage(checkStrengthError['error']);
        }
        setShowLottieError(true);
        setIsPasswordStrong(false);
      }
    }
  }, [isLoadingCheckStrength]);

  const handleClose = (): void => {
    dispatch(uiActions.appDialogSet(null));
  };

  const submitDisabled = (): boolean => {
    if (
      !(password && passwordConfirm) ||
      password !== passwordConfirm ||
      isLoadingCheckStrength
    ) {
      return true;
    }

    return false;
  };

  const handleUpdatePassword = async (data: {
    code: string;
    value: string;
    region?: string;
  }): Promise<void> => {
    try {
      const payload: UpdatePasswordPayloadType = {
        id: props.userId,
        otp: {
          code: data.code,
          id: data.value,
          method: data.region ? 'PHONE' : 'EMAIL',
        },
        password,
        passwordConfirm,
      };

      await requestUpdatePassword(payload);
    } catch (err) {
      logger.error((err as Error).message, err);
    }
  };

  const handleSubmitPassword = async (): Promise<void> => {
    if (!submitDisabled() && props.userId) {
      if (!isPasswordStrong) {
        try {
          await requestPasswordStrength({ password });
        } catch (err) {
          logger.error((err as Error).message, err);
        }
      }
    }
  };

  const handleChangePassword = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPassword(event.target.value);
  };

  const handleChangePasswordConfirm = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPasswordConfirm(event.target.value);
  };

  const renderFormContent = (): JSX.Element => {
    return (
      <CustomDialogContent
        justifyContent={SM_BREAK ? 'flex-start' : 'space-around'}
      >
        <ChangePasswordForm
          name="form-change-password"
          onSubmit={handleSubmitPassword}
        >
          <FormControl
            disabled={isLoadingCheckStrength}
            margin="normal"
            style={{
              minWidth: 300,
            }}
          >
            <InputLabel htmlFor="input-password">Password</InputLabel>
            <OutlinedInput
              id="input-password"
              name="input-password"
              onChange={handleChangePassword}
              type={showPassword ? 'text' : 'password'}
              autoCorrect="off"
              autoComplete="off"
              value={password || ''}
              fullWidth
              label={'Password'}
              endAdornment={
                showPassword ? (
                  <Visibility
                    sx={{
                      cursor: 'pointer',
                    }}
                    color="primary"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <VisibilityOff
                    sx={{
                      cursor: 'pointer',
                    }}
                    color="primary"
                    onClick={() => setShowPassword(true)}
                  />
                )
              }
            />
          </FormControl>
          <FormControl
            disabled={isLoadingCheckStrength}
            margin="normal"
            style={{
              minWidth: 300,
            }}
          >
            <InputLabel htmlFor="input-password-confirm">
              Confirm Password
            </InputLabel>
            <OutlinedInput
              id="input-password-confirm"
              name="input-password-confirm"
              onChange={handleChangePasswordConfirm}
              type={showPassword ? 'text' : 'password'}
              autoCorrect="off"
              autoComplete="off"
              value={passwordConfirm || ''}
              fullWidth
              label={'Confirm Password'}
              endAdornment={
                showPassword ? (
                  <Visibility
                    sx={{
                      cursor: 'pointer',
                    }}
                    color="primary"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <VisibilityOff
                    sx={{
                      cursor: 'pointer',
                    }}
                    color="primary"
                    onClick={() => setShowPassword(true)}
                  />
                )
              }
            />
          </FormControl>
        </ChangePasswordForm>
        {!isPasswordStrong && passwordStrengthMessage && (
          <Typography variant="h6">{passwordStrengthMessage}</Typography>
        )}
      </CustomDialogContent>
    );
  };

  return (
    <DialogWrapper maxWidth={400}>
      <DialogTitle
        style={{
          textAlign: 'center',
        }}
      >
        Change Password
      </DialogTitle>
      {!allSucceeded &&
        !showLottieError &&
        !isPasswordStrong &&
        renderFormContent()}
      {!allSucceeded && !showLottieError && isPasswordStrong && (
        <CustomDialogContent>
          <AuthWebRequestOtpEntry
            hasCallbackError={!!updatePasswordlError}
            onCompleteCallback={(
              value: string,
              code: string,
              region?: string
            ) => {
              void handleUpdatePassword({
                code,
                value,
                region,
              });
            }}
          />
        </CustomDialogContent>
      )}
      {showLottieError && (
        <CustomDialogContent>
          <DialogError message={errorMessage} />
        </CustomDialogContent>
      )}
      {allSucceeded && (
        <CustomDialogContent>
          <SuccessLottie
            complete={() => setTimeout(() => handleClose(), 500)}
          />
        </CustomDialogContent>
      )}
      {!allSucceeded && (
        <DialogActions
          style={{
            justifyContent: isMobileWidth ? 'center' : 'flex-end',
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={isLoadingCheckStrength || isLoadingUpdatePassword}
          >
            {showLottieError ? 'Close' : 'Cancel'}
          </Button>
          {!showLottieError && !isPasswordStrong && (
            <Button
              onClick={handleSubmitPassword}
              variant="contained"
              disabled={submitDisabled()}
            >
              {isLoadingCheckStrength ? (
                <BeatLoader
                  color={themeColors.secondary}
                  size={16}
                  margin="2px"
                />
              ) : (
                'Update'
              )}
            </Button>
          )}
        </DialogActions>
      )}
    </DialogWrapper>
  );
};
