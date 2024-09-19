import React, { ReactElement } from 'react';
import { BeatLoader } from 'react-spinners';
import DialogActions from '@mui/material/DialogActions';
// import DialogTitle from '@mui/material/DialogTitle';
import { Button } from '@mui/material';
import DialogContentText from '@mui/material/DialogContentText';

import { store, useAppDispatch } from '@dx/store-web';
import {
  CancelLottie,
  QuestionMarkLottie,
  SuccessLottie,
  selectIsMobileWidth,
  themeColors,
  uiActions,
} from '@dx/ui-web-system';
import {
  CustomDialogContent,
  DialogError,
  DialogWrapper
} from '@dx/ui-web-dialogs';
import { logger } from '@dx/logger-web';
import { EmailType } from '@dx/email-shared';
import { useDeleteEmailProfileMutation } from './email-web-api';

type DeleteEmailDialogProps = {
  emailItem: EmailType;
  emailDataCallback: (email: EmailType) => void;
};

export const DeleteEmailDialog: React.FC<DeleteEmailDialogProps> = (
  props
): ReactElement => {
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
  const isMobileWidth = selectIsMobileWidth(store.getState());
  const dispatch = useAppDispatch();
  const [
    requestDeleteEmail,
    {
      data: deleteEmailResponse,
      error: deleteEmailError,
      isLoading: isLoadingDeleteEmail,
      isSuccess: deleteEmailSuccess,
      isUninitialized: deleteEmailUninitialized,
    },
  ] = useDeleteEmailProfileMutation();

  React.useEffect(() => {
    if (!isLoadingDeleteEmail && !deleteEmailUninitialized) {
      if (!deleteEmailError) {
        setShowLottieError(false);
        setShowLottieSuccess(true);
        setBodyMessage('Email deleted.');
      } else {
        setShowLottieError(true);
        if ('error' in deleteEmailError) {
          setBodyMessage(deleteEmailError['error']);
        }
      }
    }
  }, [isLoadingDeleteEmail]);

  React.useEffect(() => {
    if (
      deleteEmailSuccess &&
      props.emailDataCallback &&
      typeof props.emailDataCallback === 'function'
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
        return <QuestionMarkLottie />;
      }
    }

    if (showLottieCancel) {
      return (
        <CancelLottie complete={() => setTimeout(() => handleClose(), 200)} />
      );
    }

    if (showLottieSuccess) {
      return (
        <SuccessLottie complete={() => setTimeout(() => handleClose(), 500)} />
      );
    }

    return <QuestionMarkLottie />;
  };

  const showActions = (): boolean => {
    return !(showLottieCancel || showLottieSuccess);
  };

  return (
    <>
      <DialogWrapper maxWidth={400}>
        {/* <DialogTitle style={{ textAlign: 'center' }} >Confirm Deletion</DialogTitle> */}
        {showLottieError ? (
          <CustomDialogContent>
            <DialogError message={bodyMessage} />
          </CustomDialogContent>
        ) : (
          <CustomDialogContent>
            {renderLottie()}
            <DialogContentText
              id="confirm-dialog-description"
              variant="h6"
              align="center"
              margin="20px 0 0"
            >
              {bodyMessage}
            </DialogContentText>
          </CustomDialogContent>
        )}
        {showActions() && (
          <DialogActions
            style={{
              justifyContent: isMobileWidth ? 'center' : 'flex-end',
            }}
          >
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
              {showLottieError ? 'Close' : 'Cancel'}
            </Button>
            {!showLottieError && (
              <Button onClick={handleDelete} variant="contained">
                {isLoadingDeleteEmail ? (
                  <BeatLoader
                    color={themeColors.secondary}
                    size={16}
                    margin="2px"
                  />
                ) : (
                  'Delete'
                )}
              </Button>
            )}
          </DialogActions>
        )}
      </DialogWrapper>
    </>
  );
};
