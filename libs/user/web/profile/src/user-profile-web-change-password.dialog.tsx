import React,
{
  ReactElement
} from 'react';
import { BeatLoader } from 'react-spinners';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Button,
  FormControl,
  Input,
  InputLabel,
  Typography
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

import {
  store,
  useAppDispatch
} from '@dx/store-web';
import { logger } from '@dx/logger-web';
import {
  UpdatePasswordPayloadType
} from '@dx/user-shared';
import {
  CustomDialogContent,
  DialogError,
  DialogWrapper,
  LottieSuccess,
  selectIsMobileWidth,
  themeColors,
  uiActions
} from '@dx/ui-web';
import { ChangePasswordForm } from './user-profile-web-change-password.ui';
import {
  useUpdatePasswordMutation
} from './user-profile-web.api';
import {
  useCheckPasswordStrengthMutation
} from '@dx/auth-web';
import {
  AuthWebRequestOtpEntry
} from '@dx/auth-web';

type UserProfileChangePasswordPropsType = {
  userId: string;
};

export const UserProfileChangePasswordDialog: React.FC<UserProfileChangePasswordPropsType> = (props): ReactElement => {
  const [allSucceeded, setAllSucceeded] = React.useState(false);
  const [showLottieError, setShowLottieError] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isPasswordStrong, setIsPasswordStrong] = React.useState(false);
  const [passwordStrengthMessage, setPasswordStrengthMessage] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const isMobileWidth = selectIsMobileWidth(store.getState());
  const dispatch = useAppDispatch();
  const [
    requestPasswordStrength,
    {
      data: checkStrengthResponse,
      error: checkStrengthError,
      isLoading: isLoadingCheckStrength,
      isSuccess: checkStrengthSuccess,
      isUninitialized: checkStrengthUninitialized
    }
  ] = useCheckPasswordStrengthMutation();
  const [
    requestUpdatePassword,
    {
      data: updatePasswordResponse,
      error: updatePasswordlError,
      isLoading: isLoadingUpdatePassword,
      isSuccess: updatePasswordSuccess,
      isUninitialized: updatePasswordUninitialized
    }
  ] = useUpdatePasswordMutation();

  React.useEffect(() => {
    if (!props.userId) {
      handleClose();
    }
  }, []);

  React.useEffect(() => {
    if (
      !isLoadingUpdatePassword
      && !updatePasswordUninitialized
    ) {
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
    if (
      !isLoadingCheckStrength
      && !checkStrengthUninitialized
    ) {
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
      !(password && passwordConfirm)
      || password !== passwordConfirm
      || isLoadingCheckStrength
    ) {
      return true;
    }

    return false;
  };

  const handleUpdatePassword = async (data: {
    code: string,
    value: string,
    region?: string
  }): Promise<void> => {
    try {
      const payload: UpdatePasswordPayloadType = {
        id:  props.userId,
        otp: {
          code: data.code,
          id: data.value,
          method: data.region ? 'PHONE' : 'EMAIL'
        },
        password,
        passwordConfirm
      };

      await requestUpdatePassword(payload);
    } catch (err) {
      logger.error((err as Error).message, err);
    }
  };

  const handleSubmitPassword = async (): Promise<void> => {
    if (
      !submitDisabled()
      && props.userId
    ) {
      if (
        !isPasswordStrong
      ) {
        try {
          await requestPasswordStrength({ password });
        } catch (err) {
          logger.error((err as Error).message, err);
        }
      }
    }
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleChangePasswordConfirm = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPasswordConfirm(event.target.value);
  };

  const renderFormContent = (): JSX.Element => {
    return (
      <CustomDialogContent>
        <ChangePasswordForm
          name="form-change-password"
          onSubmit={handleSubmitPassword}
        >
          <FormControl
            disabled={isLoadingCheckStrength}
            margin="normal"
            variant="standard"
            style={
              {
                minWidth: 300
              }
            }
          >
            <InputLabel
              htmlFor="password"
            >
              Password
            </InputLabel>
            <Input
              id="password"
              name="password"
              onChange={handleChangePassword}
              type={showPassword ? 'text' : 'password'}
              autoCorrect="off"
              autoComplete="off"
              value={password || ''}
              fullWidth
              endAdornment={showPassword ?
                <Visibility
                  sx={{
                    cursor: 'pointer'
                  }}
                  color="primary"
                  onClick={() => setShowPassword(false)}
                />
                :
                <VisibilityOff
                  sx={{
                    cursor: 'pointer'
                  }}
                  color="primary"
                  onClick={() => setShowPassword(true)}
                />
              }
            />
          </FormControl>
          <FormControl
            disabled={isLoadingCheckStrength}
            margin="normal"
            variant="standard"
            style={
              {
                minWidth: 300
              }
            }
          >
            <InputLabel
              htmlFor="label-select"
            >
              Confirm Password
            </InputLabel>
            <Input
              id="password-confirm"
              name="password-confirm"
              onChange={handleChangePasswordConfirm}
              type={showPassword ? 'text' : 'password'}
              autoCorrect="off"
              autoComplete="off"
              value={passwordConfirm || ''}
              fullWidth
              endAdornment={showPassword ?
                <Visibility
                  sx={{
                    cursor: 'pointer'
                  }}
                  color="primary"
                  onClick={() => setShowPassword(false)}
                />
                :
                <VisibilityOff
                  sx={{
                    cursor: 'pointer'
                  }}
                  color="primary"
                  onClick={() => setShowPassword(true)}
                />
              }
            />
          </FormControl>
        </ChangePasswordForm>
        {
          !isPasswordStrong
          && passwordStrengthMessage
          && (
            <Typography
              variant="h6"
            >
              { passwordStrengthMessage }
            </Typography>
          )
        }
      </CustomDialogContent>
    );
  };

  return (
    <DialogWrapper
      maxWidth={400}
    >
      <DialogTitle
        style={
          {
            textAlign: 'center'
          }
        }
      >
        Change Password
      </DialogTitle>
      {
        !allSucceeded
        && !showLottieError
        && !isPasswordStrong
        && renderFormContent()
      }
      {
        !allSucceeded
        && !showLottieError
        && isPasswordStrong
        && (
          <CustomDialogContent>
            <AuthWebRequestOtpEntry
              hasCallbackError={!!updatePasswordlError}
              onCompleteCallback={
                (value: string, code: string, region?: string) => {
                  void handleUpdatePassword({
                    code,
                    value,
                    region
                  });
                }
              }
            />
          </CustomDialogContent>
        )
      }
      {
        showLottieError && (
          <CustomDialogContent>
            <DialogError
              message={errorMessage}
            />
          </CustomDialogContent>

        )
      }
      {
        allSucceeded && (
          <CustomDialogContent>
            <LottieSuccess
              complete={
                () => setTimeout(() => handleClose(), 500)
              }
            />
          </CustomDialogContent>

        )
      }
      {
        !allSucceeded && (
          <DialogActions
            style={
              {
                justifyContent: isMobileWidth ? 'center' : 'flex-end'
              }
            }
          >
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isLoadingCheckStrength || isLoadingUpdatePassword}
            >
              { showLottieError ? 'Close' : 'Cancel' }
            </Button>
            {
              !showLottieError
              && !isPasswordStrong
              && (
                <Button
                  onClick={handleSubmitPassword}
                  variant="contained"
                  disabled={submitDisabled()}
                >
                  {
                    (
                      isLoadingCheckStrength
                    ) ? (
                      <BeatLoader
                        color={themeColors.secondary}
                        size={16}
                        margin="2px"
                      />
                    )
                    :
                    'Update'
                  }
                </Button>
              )
            }
          </DialogActions>
        )
      }
    </DialogWrapper>
  );
};
