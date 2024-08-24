import React from 'react';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

import { useAppDispatch } from '@dx/store-web';
import { uiActions } from '../../store/ui-web.reducer';
import { CustomDialogContent } from './custom-content.dialog';
import { AlertLottie } from '../../lottie/alert.lottie';

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
        <Button
          onClick={closeDialog}
          variant="contained"
        >
          { props.buttonText || 'OK' }
        </Button>
      </DialogActions>
    </CustomDialogContent>
  );

};
