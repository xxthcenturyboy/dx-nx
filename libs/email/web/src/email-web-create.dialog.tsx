import React, { ReactElement } from 'react';
import { BeatLoader } from 'react-spinners';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  useMediaQuery,
  useTheme
} from '@mui/material';

import { useAppDispatch, useAppSelector } from '@dx/utils-web-hooks';
import { logger } from '@dx/logger-web';
import { CreateEmailPayloadType, EMAIL_LABEL } from '@dx/email-shared';
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
import { EmailType } from '@dx/email-shared';
import { regexEmail } from '@dx/util-regex';
import { AddEmailForm } from './email-web.ui';
import {
  useAddEmailMutation,
  useCheckEmailAvailabilityMutation,
} from './email-web.api';
import { AuthWebOtpEntry, useOtpRequestEmailMutation } from '@dx/auth-web';
import { OTP_LENGTH } from '@dx/auth-shared';

type AddEmailPropsType = {
  userId: string;
  emailDataCallback: (email: EmailType) => void;
};

export const AddEmailDialog: React.FC<AddEmailPropsType> = (
  props
): ReactElement => {
  const [allSucceeded, setAllSucceeded] = React.useState(false);
  const [showLottieError, setShowLottieError] = React.useState(false);
  const [hasSentOtp, setHasSentOtp] = React.useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [label, setLabel] = React.useState(EMAIL_LABEL.PERSONAL);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [isDefault, setIsDefault] = React.useState(false);
  const isMobileWidth = useAppSelector(state => selectIsMobileWidth(state));
  const theme = useTheme();
  const SM_BREAK = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useAppDispatch();
  const [
    requestCheckAvailability,
    {
      data: checkAvailabilityResponse,
      error: checkAvailabilityError,
      isLoading: isLoadingCheckAvailability,
      isSuccess: checkAvailabilitySuccess,
      isUninitialized: checkAvailabilityUninitialized,
    },
  ] = useCheckEmailAvailabilityMutation();
  const [
    requestAddEmail,
    {
      data: addEmailResponse,
      error: addEmailError,
      isLoading: isLoadingAddEmail,
      isSuccess: addEmailSuccess,
      isUninitialized: addEmailUninitialized,
    },
  ] = useAddEmailMutation();
  const [
    sendOtpCode,
    {
      data: sendOtpResponse,
      error: sendOtpError,
      isLoading: isLoadingSendOtp,
      isSuccess: sendOtpSuccess,
      isUninitialized: sendOtpUninitialized,
    },
  ] = useOtpRequestEmailMutation();

  React.useEffect(() => {
    if (!props.userId) {
      handleClose();
    }
  }, []);

  React.useEffect(() => {
    if (!isLoadingAddEmail && !addEmailUninitialized) {
      if (!addEmailError) {
        setShowLottieError(false);
        setAllSucceeded(true);
      } else {
        if ('error' in addEmailError) {
          setErrorMessage(addEmailError['error']);
        }
        setShowLottieError(true);
      }
    }
  }, [isLoadingAddEmail]);

  React.useEffect(() => {
    if (!isLoadingCheckAvailability && !checkAvailabilityUninitialized) {
      if (!checkAvailabilityError) {
        setShowLottieError(false);
        setIsEmailAvailable(true);
      } else {
        if ('error' in checkAvailabilityError) {
          setErrorMessage(checkAvailabilityError['error']);
        }
        setShowLottieError(true);
        setIsEmailAvailable(false);
      }
    }
  }, [isLoadingCheckAvailability]);

  React.useEffect(() => {
    if (!isLoadingSendOtp) {
      if (!sendOtpError) {
        setShowLottieError(false);
      } else {
        if ('error' in sendOtpError) {
          setErrorMessage(sendOtpError['error']);
        }
        setShowLottieError(true);
      }
    }
  }, [isLoadingSendOtp]);

  React.useEffect(() => {
    if (
      addEmailSuccess &&
      props.emailDataCallback &&
      typeof props.emailDataCallback === 'function'
    ) {
      props.emailDataCallback({
        id: addEmailResponse.id,
        email,
        label,
        isDeleted: false,
        isVerified: true,
        default: isDefault,
      });
    }
  }, [addEmailSuccess]);

  React.useEffect(() => {
    if (checkAvailabilitySuccess && sendOtpUninitialized) {
      sendOtpCode({ email }).catch((err) =>
        logger.error((err as Error).message, err)
      );
    }
  }, [checkAvailabilitySuccess]);

  React.useEffect(() => {
    if (sendOtpSuccess) {
      setHasSentOtp(true);
    }
  }, [sendOtpSuccess]);

  React.useEffect(() => {
    if (otp.length === OTP_LENGTH) {
      void handleCreate();
    }
  }, [otp]);

  const handleClose = (): void => {
    dispatch(uiActions.appDialogSet(null));
  };

  const submitDisabled = (): boolean => {
    if (
      !(email && label) ||
      !regexEmail.test(email) ||
      isLoadingAddEmail ||
      isLoadingSendOtp
    ) {
      return true;
    }

    if (hasSentOtp && otp.length < 6) {
      return true;
    }

    return false;
  };

  const handleCreate = async (): Promise<void> => {
    if (!submitDisabled() && props.userId) {
      if (!isEmailAvailable && !hasSentOtp) {
        try {
          await requestCheckAvailability(email);
        } catch (err) {
          logger.error((err as Error).message, err);
        }
      }

      if (hasSentOtp && otp) {
        try {
          const payload: CreateEmailPayloadType = {
            code: otp,
            label,
            email,
            def: isDefault,
            userId: props.userId,
          };

          await requestAddEmail(payload);
        } catch (err) {
          logger.error((err as Error).message, err);
        }
      }
    }
  };

  const handleChangeEmail = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setEmail(event.target.value);
  };

  const handleChangeLabel = (event: SelectChangeEvent<string>): void => {
    setLabel(event.target.value);
  };

  const renderFormContent = (): JSX.Element => {
    return (
      <CustomDialogContent
        justifyContent={SM_BREAK ? 'flex-start' : 'space-around'}
      >
        <AddEmailForm name="form-add-email" onSubmit={handleCreate}>
          <FormControl
            margin="normal"
            sx={{
              minWidth: 300,
            }}
          >
            <InputLabel htmlFor="input-email">Email</InputLabel>
            <OutlinedInput
              id="input-email"
              name="input-email"
              onChange={handleChangeEmail}
              type="email"
              autoCapitalize="off"
              autoCorrect="off"
              value={email || ''}
              placeholder={'Email'}
              fullWidth
              label={'Email'}
            />
          </FormControl>
          <FormControl
            disabled={isLoadingAddEmail}
            margin="normal"
            variant="outlined"
          >
            <InputLabel htmlFor="label-select">Label</InputLabel>
            <Select
              id="label-select"
              name="label-select"
              value={label || ''}
              onChange={handleChangeLabel}
              notched
              label="Label"
            >
              {Object.values(EMAIL_LABEL).map((labelValue) => {
                return (
                  <MenuItem key={labelValue} value={labelValue}>
                    {labelValue}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControlLabel
            label="Set as Default"
            control={
              <Checkbox
                size="large"
                checked={isDefault}
                onChange={() => setIsDefault(!isDefault)}
              />
            }
          />
        </AddEmailForm>
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
        {`New Email`}
      </DialogTitle>
      {!allSucceeded && !showLottieError && !hasSentOtp && renderFormContent()}
      {!allSucceeded && !showLottieError && isEmailAvailable && hasSentOtp && (
        <CustomDialogContent>
          <AuthWebOtpEntry method="EMAIL" onCompleteCallback={setOtp} />
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
            disabled={isLoadingAddEmail}
          >
            {showLottieError ? 'Close' : 'Cancel'}
          </Button>
          {!showLottieError && (
            <Button
              onClick={handleCreate}
              variant="contained"
              disabled={submitDisabled()}
            >
              {isLoadingAddEmail ||
              isLoadingCheckAvailability ||
              isLoadingSendOtp ? (
                <BeatLoader
                  color={themeColors.secondary}
                  size={16}
                  margin="2px"
                />
              ) : (
                'Create'
              )}
            </Button>
          )}
        </DialogActions>
      )}
    </DialogWrapper>
  );
};
