import React,
{
  ReactElement
} from 'react';
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
  Select,
  SelectChangeEvent
} from '@mui/material';
import { CountryData } from 'react-phone-input-2';
import {
  CountryCode,
  isValidPhoneNumber
} from 'libphonenumber-js';


import {
  useAppDispatch
} from '@dx/store-web';
import { logger } from '@dx/logger-web';
import {
  CreatePhonePayloadType,
  PHONE_LABEL,
  PhoneType
} from '@dx/phone-shared';
import {
  CustomDialogContent,
  DialogError,
  DialogWrapper,
  LottieSuccess,
  themeColors,
  uiActions
} from '@dx/ui-web';
import { PhoneNumberInput } from './phone-input/phone-web-input.component';
import { AddPhoneForm } from './phone-web.ui';
import {
  useCheckPhoneAvailabilityMutation,
  useAddPhoneMutation
} from './phone-web-api';
import {
  AuthWebOtpEntry,
  useOtpRequestPhoneMutation
} from '@dx/auth-web';
import { OTP_LENGTH } from '@dx/auth-shared';

type AddPhoneDialogProps = {
  userId: string;
  phoneDataCallback: (phone: PhoneType) => void;
};

export const AddPhoneDialog: React.FC<AddPhoneDialogProps> = (props): ReactElement => {
  const [allSucceeded, setAllSucceeded] = React.useState(false);
  const [showLottieError, setShowLottieError] = React.useState(false);
  const [hasSentOtp, setHasSentOtp] = React.useState(false);
  const [isPhoneAvailable, setIsPhoneAvailable] = React.useState(false);
  const [phone, setPhone] = React.useState('');
  const [countryData, setCountryData] = React.useState<CountryData | null>(null);
  const [label, setLabel] = React.useState(PHONE_LABEL.CELL);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [isDefault, setIsDefault] = React.useState(false);
  const dispatch = useAppDispatch();
  const [
    requestCheckAvailability,
    {
      data: checkAvailabilityResponse,
      error: checkAvailabilityError,
      isLoading: isLoadingCheckAvailability,
      isSuccess: checkAvailabilitySuccess,
      isUninitialized: checkAvailabilityUninitialized
    }
  ] = useCheckPhoneAvailabilityMutation();
  const [
    requestAddPhone,
    {
      data: addPhoneResponse,
      error: addPhoneError,
      isLoading: isLoadingAddPhone,
      isSuccess: addPhoneSuccess,
      isUninitialized: addPhoneUninitialized
    }
  ] = useAddPhoneMutation();
  const [
    sendOtpCode,
    {
      data: sendOtpResponse,
      error: sendOtpError,
      isLoading: isLoadingSendOtp,
      isSuccess: sendOtpSuccess,
      isUninitialized: sendOtpUninitialized
    }
  ] = useOtpRequestPhoneMutation();

  React.useEffect(() => {
    if (!props.userId) {
      handleClose();
    }
  }, []);

  React.useEffect(() => {
    if (
      !isLoadingAddPhone
      && !addPhoneUninitialized
    ) {
      if (!addPhoneError) {
        setShowLottieError(false);
        setAllSucceeded(true);
      } else {
        if ('error' in addPhoneError) {
          setErrorMessage(addPhoneError['error']);
        }
        setShowLottieError(true);
      }
    }
  }, [isLoadingAddPhone]);

  React.useEffect(() => {
    if (
      !isLoadingCheckAvailability
      && !checkAvailabilityUninitialized
    ) {
      if (!checkAvailabilityError) {
        setShowLottieError(false);
        setIsPhoneAvailable(true);
      } else {
        if ('error' in checkAvailabilityError) {
          setErrorMessage(checkAvailabilityError['error']);
        }
        setShowLottieError(true);
        setIsPhoneAvailable(false);
      }
    }
  }, [isLoadingCheckAvailability]);

  React.useEffect(() => {
    if (
      !isLoadingSendOtp
    ) {
      if (
        !sendOtpError
      ) {
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
      addPhoneSuccess
      && props.phoneDataCallback
      && typeof props.phoneDataCallback === 'function'
    ) {
      props.phoneDataCallback({
        id: addPhoneResponse.id,
        countryCode: (countryData as CountryData).countryCode,
        phone,
        phoneFormatted: addPhoneResponse.phoneFormatted,
        label,
        isDeleted: false,
        isSent: true,
        isVerified: true,
        default: isDefault
      });
    }
  }, [addPhoneSuccess]);

  React.useEffect(() => {
    if (
      checkAvailabilitySuccess
      && sendOtpUninitialized
    ) {
      sendOtpCode({ phone, regionCode: (countryData as CountryData).countryCode, })
        .catch((err) => logger.error((err as Error).message, err));
    }
  }, [checkAvailabilitySuccess]);

  React.useEffect(() => {
    if (
      sendOtpSuccess
    ) {
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
    const countryCode = countryData?.countryCode
      ? countryData.countryCode.toUpperCase() as CountryCode
      : 'US';
    if (
      !(phone && countryData && label)
      || !isValidPhoneNumber(phone, countryCode)
      || isLoadingAddPhone
      || isLoadingSendOtp
    ) {
      return true;
    }

    if (
      hasSentOtp
      && otp.length < 6
    ) {
      return true;
    }

    return false;
  };

  const handleCreate = async (): Promise<void> => {
    if (
      !submitDisabled()
      && props.userId
    ) {
      if (
        !isPhoneAvailable
        && !hasSentOtp
      ) {
        try {
          await requestCheckAvailability({ phone, regionCode: (countryData as CountryData).countryCode, });
        } catch (err) {
          logger.error((err as Error).message, err);
        }
      }

      if (
        hasSentOtp
        && otp
      ) {
        try {
          const payload: CreatePhonePayloadType = {
            code: otp,
            label,
            phone,
            regionCode: (countryData as CountryData).countryCode,
            def: isDefault,
            userId: props.userId
          };

          await requestAddPhone(payload);
        } catch (err) {
          logger.error((err as Error).message, err);
        }
      }
    }
  };

  const handleChangeLabel = (event: SelectChangeEvent<string>): void => {
    setLabel(event.target.value);
  };

  const renderFormContent = (): JSX.Element => {
    return (
      <CustomDialogContent>
        <AddPhoneForm
          name="form-add-phone"
          onSubmit={handleCreate}
        >
          <FormControl
            disabled={isLoadingAddPhone}
            margin="normal"
            variant="standard"
            style={{ minWidth: 300 }}
          >
            <InputLabel
              htmlFor="new-user-phone"
              style={{
                position: 'absolute',
                top: -33,
                left: 5,
                fontSize: '14px'
              }}
            >
              Phone
            </InputLabel>
            <PhoneNumberInput
              defaultCountry="us"
              defaultValue=""
              inputId="new-user-phone"
              preferredCountries={['us']}
              required={true}
              disabled={false}
              onChange={(value: string, data: CountryData) => {
                setPhone(value);
                setCountryData(data);
              }}
              value={phone || ''}
            />
          </FormControl>
          <FormControl
            disabled={isLoadingAddPhone}
            margin="normal"
            variant="standard"
          >
            <InputLabel htmlFor="label-select">Label</InputLabel>
            <Select
              id="label-select"
              name="label-select"
              value={label || ''}
              onChange={handleChangeLabel}
            >
              {
                Object.values(PHONE_LABEL).map((labelValue) => {
                  return (
                    <MenuItem
                      key={labelValue}
                      value={labelValue}
                    >
                      {labelValue}
                    </MenuItem>
                  );
                })
              }
            </Select>
          </FormControl>
          <FormControlLabel
            label="Set as Default"
            control={<Checkbox
              checked={isDefault}
              onChange={() => setIsDefault(!isDefault)}
            />}
          />
        </AddPhoneForm>
      </CustomDialogContent>
    );
  };

  return (
    <DialogWrapper maxWidth={400}>
      <DialogTitle style={{ textAlign: 'center' }} >
        { `New Phone` }
      </DialogTitle>
      {
        !allSucceeded
        && !showLottieError
        && !hasSentOtp
        && renderFormContent()
      }
      {
        !allSucceeded
        && !showLottieError
        && isPhoneAvailable
        && hasSentOtp
        && (
          <CustomDialogContent>
            <AuthWebOtpEntry
              method="PHONE"
              onCompleteCallback={setOtp}
            />
          </CustomDialogContent>
        )
      }
      {
        showLottieError && (
          <DialogError message={errorMessage} />
        )
      }
      {
        allSucceeded && (
          <LottieSuccess complete={() => setTimeout(() => handleClose(), 700)} />
        )
      }
      {
        !allSucceeded && (
          <DialogActions>
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isLoadingAddPhone}
            >
              { showLottieError ? 'Close' : 'Cancel' }
            </Button>
            {
              !showLottieError && (
                <Button
                  onClick={handleCreate}
                  variant="contained"
                  disabled={submitDisabled()}
                >
                  {
                    (
                      isLoadingAddPhone
                      || isLoadingCheckAvailability
                      || isLoadingSendOtp
                    ) ? (
                      <BeatLoader
                        color={themeColors.secondary}
                        size={16}
                        margin="2px"
                      />
                    )
                    :
                    'Create'
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
