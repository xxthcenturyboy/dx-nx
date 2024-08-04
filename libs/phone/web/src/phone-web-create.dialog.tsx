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
import { PhoneInputComponent } from './phone-input/phone-web-input.component';
import { AddPhoneForm } from './phone-web.ui';
import { useAddPhoneMutation } from './phone-web-api';

type AddPhoneDialogProps = {
  userId: string;
  phoneDataCallback: (phone: PhoneType) => void;
};

export const AddPhoneDialog: React.FC<AddPhoneDialogProps> = (props): ReactElement => {
  const [allSucceeded, setAllSucceeded] = React.useState(false);
  const [showLottieError, setShowLottieError] = React.useState(false);
  const [previousXHR, setPreviousXHR] = React.useState(false);
  const [phone, setPhone] = React.useState('');
  const [countryData, setCountryData] = React.useState('');
  const [label, setLabel] = React.useState('');
  const [isDefault, setIsDefault] = React.useState(false);
  const dispatch = useAppDispatch();
  const [
    requestAddPhone,
    {
      data: addPhoneResponse,
      error: addPhoneError,
      isLoading: isLoadingAddPhone,
      isSuccess: addPhoneSuccess
    }
  ] = useAddPhoneMutation();

  React.useEffect(() => {
    if (!props.userId) {
      handleClose();
    }
  }, []);

  React.useEffect(() => {
    if (
      !isLoadingAddPhone
      && previousXHR
    ) {
      if (!addPhoneError) {
        setShowLottieError(false);
        setAllSucceeded(true);
      } else {
        setShowLottieError(true);
      }
    }
    setPreviousXHR(isLoadingAddPhone);
  }, [isLoadingAddPhone]);

  React.useEffect(() => {
    if (
      addPhoneSuccess
      && props.phoneDataCallback
      && typeof props.phoneDataCallback === 'function'
    ) {
      props.phoneDataCallback({
        id: addPhoneResponse.id,
        countryCode: countryData,
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

  const handleClose = (): void => {
    dispatch(uiActions.appDialogSet(null));
  };

  const handleCreate = async (): Promise<void> => {
    if (
      !submitDisabled()
      && props.userId
    ) {
      try {
        const payload: CreatePhonePayloadType = {
          label,
          phone,
          countryCode: countryData,
          def: isDefault,
          userId: props.userId
        };

        await requestAddPhone(payload);
      } catch (err) {
        logger.error((err as Error).message, err);
      }
    }
  };

  const handleChangeLabel = (event: SelectChangeEvent<string>): void => {
    setLabel(event.target.value);
  };

  const submitDisabled = (): boolean => {
    if (!(phone && countryData && label) || isLoadingAddPhone) {
      return true;
    }

    return false;
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
            <PhoneInputComponent
              defaultCountry="us"
              defaultValue=""
              inputId="new-user-phone"
              preferredCountries={['us']}
              required={true}
              disabled={false}
              onChange={(value: string, data: CountryData) => {
                setPhone(value);
                setCountryData(data.countryCode);
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
        {`New Phone`}
      </DialogTitle>
      {
        !allSucceeded && !showLottieError && renderFormContent()
      }
      {
        showLottieError && (
          <DialogError message={addPhoneError as string} />
        )
      }
      {
        allSucceeded && (
          <LottieSuccess complete={() => setTimeout(() => handleClose(), 500)} />
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
              {showLottieError ? 'Close' : 'Cancel'}
            </Button>
            {
              !showLottieError && (
                <Button
                  onClick={handleCreate}
                  variant="contained"
                  disabled={submitDisabled()}
                >
                  {
                    isLoadingAddPhone ? (
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
