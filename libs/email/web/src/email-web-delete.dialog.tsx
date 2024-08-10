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
  EmailType
} from '@dx/email-shared';
import { useDeleteEmailProfileMutation } from './email-web-api';

type DeleteEmailDialogProps = {
  emailItem: EmailType;
  emailDataCallback: (email: EmailType) => void;
};

export const DeleteEmailDialog: React.FC<DeleteEmailDialogProps> = (props): ReactElement => {
  const { emailItem } = props;
  const [showLottieInitial] = React.useState(true);
  const [showLottieCancel, setShowLottieCancel] = React.useState(false);
  const [showLottieSuccess, setShowLottieSuccess] = React.useState(false);
  const [showLottieError, setShowLottieError] = React.useState(false);
  const [bodyMessage, setBodyMessage] = React.useState(
    emailItem
      ? `Are you sure you want to delete the email: ${emailItem.email} (${emailItem.label})?`
      : ''
  );
  const dispatch = useAppDispatch();
  const [
    requestDeleteEmail,
    {
      data: deleteEmailResponse,
      error: deleteEmailError,
      isLoading: isLoadingDeleteEmail,
      isSuccess: deleteEmailSuccess,
      isUninitialized: deleteEmailUninitialized
    }
  ] = useDeleteEmailProfileMutation();

  React.useEffect(() => {
    if (
      !isLoadingDeleteEmail
      && !deleteEmailUninitialized
    ) {
      if (!deleteEmailError) {
        setShowLottieError(false);
        setShowLottieSuccess(true);
        setBodyMessage('Email deleted.');
      } else {
        setShowLottieError(true);
        // @ts-expect-error - stupid
        setBodyMessage(deleteEmailError.data as unknown as string);
      }
    }
  }, [isLoadingDeleteEmail]);

  React.useEffect(() => {
    if (
      deleteEmailSuccess
      && props.emailDataCallback
      && typeof props.emailDataCallback === 'function'
    ) {
      props.emailDataCallback(emailItem);
    }
  }, [deleteEmailSuccess]);

  const handleClose = (): void => {
    dispatch(uiActions.appDialogSet(null));
  };

  const handleDelete = async (): Promise<void> => {
    try {
      if (emailItem) {
        await requestDeleteEmail(emailItem.id);
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
                      isLoadingDeleteEmail ? (
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
