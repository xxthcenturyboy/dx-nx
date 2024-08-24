import React,
{
  DetailedHTMLProps,
  ReactElement
} from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import Box from '@mui/material/Box';
import {
  useMediaQuery,
  useTheme
} from '@mui/material';
// import Zoom from '@mui/material/Zoom';

import {
  CancelLottie,
  QuestionMarkLottie,
  SuccessLottie
} from '@dx/ui-web';
import { DialogWrapper } from './ui-wrapper.dialog';
import { CustomDialogContent } from './custom-content.dialog';

type ConfirmationDialogProps = {
  okText?: string;
  cancelText?: string;
  bodyMessage?: string;
  bodyMessageHtml?: React.ReactNode;
  // bodyMessageHtml?: DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  noAwait?: boolean;
  title?: string;
  onComplete(confirmation?: boolean): void;
};

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  okText,
  cancelText,
  bodyMessage,
  bodyMessageHtml,
  noAwait,
  title,
  onComplete
}): ReactElement => {
  const [showLottieInitial, setShowLottieInitial] = React.useState<boolean>(true);
  const [showLottieCancel, setShowLottieCancel] = React.useState<boolean>(false);
  const [showLottieSuccess, setShowLottieSuccess] = React.useState<boolean>(false);
  const [messageText, setMessageText] = React.useState<string>(bodyMessage || '');
  const theme = useTheme();
  const smBreak = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = (): void => {
    onComplete(false);
  };

  const handleConfirmation = (): void => {
    if (!noAwait) {
      setTimeout(() => onComplete(true), 500);
    }
  };

  const handleCancel = (): void => {
    setMessageText('Cancelling');
    setShowLottieCancel(true);
  };

  const handleClickConfirm = (): void => {
    setMessageText(okText || 'Ok');
    setShowLottieSuccess(true);
    if (noAwait) {
      onComplete(true);
    }
  };

  return (
    <DialogWrapper>
        {/* <DialogTitle style={{ textAlign: 'center' }} >{title || APP_NAME}</DialogTitle> */}
        <CustomDialogContent>
          {
            showLottieInitial
            && !(
              showLottieCancel
              || showLottieSuccess
            )
            && (
              <QuestionMarkLottie />
            )
          }
          {
            showLottieCancel && (
              <CancelLottie complete={handleClose} />
            )
          }
          {
            showLottieSuccess && (
              <SuccessLottie complete={handleConfirmation} />
            )
          }
          <DialogContentText id="confirm-dialog-description" variant="h6" align="center" margin="0 0 20px">
            { messageText || 'Are you sure?' }
          </DialogContentText>
          { bodyMessageHtml }
        </CustomDialogContent>

        {
          !(
            showLottieCancel
            || showLottieSuccess
          )
          && (
            <DialogActions
              style={{
                justifyContent: smBreak ? 'center' : 'flex-end'
              }}
            >
              {
                cancelText && (
                  <Button variant="outlined" onClick={handleCancel}>
                    {cancelText}
                  </Button>
                )
              }
              <Button
                onClick={handleClickConfirm}
                variant="contained"
              >
                { okText || 'OK' }
              </Button>
            </DialogActions>
          )
        }
    </DialogWrapper>
  );
};
