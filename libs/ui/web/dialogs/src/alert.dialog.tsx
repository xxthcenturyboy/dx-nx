import React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

import { useAppDispatch } from '@dx/utils-web-hooks';
import { uiActions } from '@dx/ui-web-system';
import { AlertLottie } from '@dx/ui-web-lottie';
import { CustomDialogContent } from './custom-content.dialog';

type DialogAlertType = {
  buttonText?: string;
  message?: string;
};

export const DialogAlert: React.FC<DialogAlertType> = (props) => {
  const dispatch = useAppDispatch();

  const closeDialog = (): void => {
    dispatch(uiActions.appDialogSet(null));
  };

  return (
    <CustomDialogContent>
      <AlertLottie />
      <DialogContentText
        id="dialog-api-alert"
        variant="body1"
        align="center"
        color="default"
        margin="20px 0 0"
      >
        {props.message || 'Something went wrong.'}
      </DialogContentText>
      <DialogActions>
        <Button onClick={closeDialog} variant="contained">
          {props.buttonText || 'OK'}
        </Button>
      </DialogActions>
    </CustomDialogContent>
  );
};
