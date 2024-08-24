import React from 'react';
import { DialogContentText } from '@mui/material';

import { CustomDialogContent } from './custom-content.dialog';
import { AlertLottie } from '../../lottie/alert.lottie';
// import { ERROR_MSG } from '@dx/config-shared';

type DialogErrorType = {
  message?: string;
};

export const DialogError: React.FC<DialogErrorType> = ({ message }) => {
  return (
    <CustomDialogContent>
      <AlertLottie />
      <DialogContentText
        id="dialog-error"
        variant="h6"
        align="center"
        color="default"
        margin="20px 0 0"
      >
        {/* <span>
          { ERROR_MSG }
        </span>
        <br />
        <br /> */}
        { message || '' }
      </DialogContentText>
    </CustomDialogContent>
  );

};
