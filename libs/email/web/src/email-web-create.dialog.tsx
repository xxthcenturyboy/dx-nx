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
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';

import {
  useAppDispatch
} from '@dx/store-web';
import { logger } from '@dx/logger-web';
import {
  CreateEmailPayloadType,
  EMAIL_LABEL
} from '@dx/email-shared';
import {
  CustomDialogContent,
  DialogError,
  DialogWrapper,
  LottieSuccess,
  themeColors,
  uiActions
} from '@dx/ui-web';
import { EmailType } from '@dx/email-shared';
import { AddEmailForm } from './email-web.ui';
import { useAddEmailMutation } from './email-web-api';

type AddEmailPropsType = {
  userId: string;
  emailDataCallback: (email: EmailType) => void;
};

export const AddEmailDialog: React.FC<AddEmailPropsType> = (props): ReactElement => {
  const [allSucceeded, setAllSucceeded] = React.useState(false);
  const [showLottieError, setShowLottieError] = React.useState(false);
  const [previousXHR, setPreviousXHR] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [label, setLabel] = React.useState('');
  const [isDefault, setIsDefault] = React.useState(false);
  const dispatch = useAppDispatch();
  const [
    requestAddEmail,
    {
      data: addEmailResponse,
      error: addEmailError,
      isLoading: isLoadingAddEmail,
      isSuccess: addEmailSuccess
    }
  ] = useAddEmailMutation();

  React.useEffect(() => {
    if (!props.userId) {
      handleClose();
    }
  }, []);

  React.useEffect(() => {
    if (
      !isLoadingAddEmail
      && previousXHR
    ) {
      if (!addEmailError) {
        setShowLottieError(false);
        setAllSucceeded(true);
      } else {
        setShowLottieError(true);
      }
    }
    setPreviousXHR(isLoadingAddEmail);
  }, [isLoadingAddEmail]);

  React.useEffect(() => {
    if (
      addEmailSuccess
      && props.emailDataCallback
      && typeof props.emailDataCallback === 'function'
    ) {
      props.emailDataCallback({
        id: addEmailResponse.id,
        email,
        label,
        isDeleted: false,
        isVerified: true,
        default: isDefault
      });
    }
  }, [addEmailSuccess]);

  const handleClose = (): void => {
    dispatch(uiActions.appDialogSet(null));
  };

  const handleCreate = async (): Promise<void> => {
    if (
      !submitDisabled()
      && props.userId
    ) {
      try {
        const payload: CreateEmailPayloadType = {
          label,
          email,
          def: isDefault,
          userId: props.userId
        };

        await requestAddEmail(payload);
      } catch (err) {
        logger.error((err as Error).message, err);
      }
    }
  };

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handleChangeLabel = (event: SelectChangeEvent<string>): void => {
    setLabel(event.target.value);
  };

  const submitDisabled = (): boolean => {
    if (
      !(email && label)
      || isLoadingAddEmail
    ) {
      return true;
    }

    return false;
  };

  const renderFormContent = (): JSX.Element => {
    return (
      <CustomDialogContent>
        <AddEmailForm
          name="form-add-email"
          onSubmit={handleCreate}
        >
          <FormControl
            disabled={isLoadingAddEmail}
            margin="normal"
            variant="standard"
            style={{ minWidth: 300 }}
          >
            <InputLabel htmlFor="email">Email</InputLabel>
            <Input
              id="email"
              name="email"
              onChange={handleChangeEmail}
              type="email"
              autoCorrect="off"
              autoComplete="off"
              value={email || ''}
              fullWidth
            />
          </FormControl>
          <FormControl
            disabled={isLoadingAddEmail}
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
                Object.values(EMAIL_LABEL).map((labelValue) => {
                  return (
                    <MenuItem
                      key={labelValue}
                      value={labelValue}
                    >
                      { labelValue }
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
        </AddEmailForm>
      </CustomDialogContent>
    );
  };

  return (
    <DialogWrapper maxWidth={400}>
      <DialogTitle style={{ textAlign: 'center' }} >
        {`New Email`}
      </DialogTitle>
      {
        !allSucceeded && !showLottieError && renderFormContent()
      }
      {
        showLottieError && (
          <DialogError message={addEmailError as string} />
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
              disabled={isLoadingAddEmail}
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
                    isLoadingAddEmail ? (
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
