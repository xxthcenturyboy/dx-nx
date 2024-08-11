import React,
{
  ReactElement
} from 'react';
import { BeatLoader } from 'react-spinners';
import DialogActions from '@mui/material/DialogActions';
// import DialogTitle from '@mui/material/DialogTitle';
import {
  Button
} from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText';

import {
  useAppDispatch
} from '@dx/store-web';
import {
  CustomDialogContent,
  DialogError,
  DialogWrapper,
  LottieCancel,
  LottieQuestionMark,
  LottieSuccess,
  themeColors,
  uiActions
} from '@dx/ui-web';
import { logger } from '@dx/logger-web';
import {
  PhoneType
} from '@dx/phone-shared';
import { useDeletePhoneProfileMutation } from './phone-web-api';

type DeletePhoneDialogProps = {
  phoneItem: PhoneType;
  phoneDataCallback: (email: PhoneType) => void;
};

export const DeletePhoneDialog: React.FC<DeletePhoneDialogProps> = (props): ReactElement => {
  const { phoneItem } = props;
  const [showLottieInitial] = React.useState(true);
  const [showLottieCancel, setShowLottieCancel] = React.useState(false);
  const [showLottieSuccess, setShowLottieSuccess] = React.useState(false);
  const [showLottieError, setShowLottieError] = React.useState(false);
  const [bodyMessage, setBodyMessage] = React.useState(
    phoneItem
      ? `Are you sure you want to delete the phone: ${phoneItem.uiFormatted} (${phoneItem.label})?`
      : ''
  );
  const dispatch = useAppDispatch();
  const [
    requestDeletePhone,
    {
      data: deletePhoneResponse,
      error: deletePhoneError,
      isLoading: isLoadingDeletePhone,
      isSuccess: deletePhoneSuccess,
      isUninitialized: deletePhoneUninitialized
    }
  ] = useDeletePhoneProfileMutation();

  React.useEffect(() => {
    if (
      !isLoadingDeletePhone
      && !deletePhoneUninitialized
    ) {
      if (!(deletePhoneError)) {
        setShowLottieError(false);
        setShowLottieSuccess(true);
        setBodyMessage('Phone deleted.');
      } else {
        setShowLottieError(true);
        if ('error' in deletePhoneError) {
          setBodyMessage(deletePhoneError['error']);
        }
      }
    }
  }, [isLoadingDeletePhone]);

  React.useEffect(() => {
    if (
      deletePhoneSuccess
      && props.phoneDataCallback
      && typeof props.phoneDataCallback === 'function'
    ) {
      props.phoneDataCallback(phoneItem);
    }
  }, [deletePhoneSuccess]);

  const handleClose = (): void => {
    dispatch(uiActions.appDialogSet(null));
  };

  const handleDelete = async (): Promise<void> => {
    try {
      if (phoneItem) {
        await requestDeletePhone(phoneItem.id);
      }
    } catch (err) {
      logger.error((err as Error).message, err);
    }
  };

  const renderLottie = (): JSX.Element => {
    if (showLottieInitial) {
      if (!(showLottieCancel || showLottieError || showLottieSuccess)) {
        return (<LottieQuestionMark />);
      }
    }

    if (showLottieCancel) {
      return (<LottieCancel complete={() => setTimeout(() => handleClose(), 200)} />);
    }

    if (showLottieSuccess) {
      return (<LottieSuccess complete={() => setTimeout(() => handleClose(), 500)} />);
    }

    return (<LottieQuestionMark />);
  };

  const showActions = (): boolean => {
    return !(showLottieCancel || showLottieSuccess);
  };

  return (
    <>
      <DialogWrapper maxWidth={400}>
        {/* <DialogTitle style={{ textAlign: 'center' }} >Confirm Deletion</DialogTitle> */}
        {
          showLottieError ?
          (
            <DialogError message={bodyMessage} />
          )
          :
          (
            <CustomDialogContent>
              {
                renderLottie()
              }
              <DialogContentText
                id="confirm-dialog-description"
                variant="h6"
                align="center"
                margin="20px 0 0"
              >
                { bodyMessage }
              </DialogContentText>
            </CustomDialogContent>
          )
        }
        {
          showActions() && (
            <DialogActions>
              <Button
                variant="outlined"
                onClick={() => {
                  if (showLottieError) {
                    handleClose();
                    return;
                  }

                  setBodyMessage('Canceling');
                  setShowLottieCancel(true);
                }}
              >
                { showLottieError ? 'Close' : 'Cancel' }
              </Button>
              {
                !showLottieError && (
                  <Button
                    onClick={handleDelete}
                    variant="contained"
                  >
                    {
                      isLoadingDeletePhone ? (
                        <BeatLoader
                          color={themeColors.secondary}
                          size={16}
                          margin="2px"
                        />
                      )
                      :
                      'Delete'
                    }
                  </Button>
                )
              }

            </DialogActions>
          )
        }
      </DialogWrapper>
    </>
  );
};
