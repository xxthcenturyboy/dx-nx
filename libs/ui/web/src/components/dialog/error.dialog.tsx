import React from 'react';
import { DialogContentText } from '@mui/material';

import { CustomDialogContent } from './custom-content.dialog';
import { LottieError } from '../../lottie/LottieError';
import { ERROR_MSG } from '@dx/config-shared';

type DialogErrorType = {
  message?: string;
};

export const DialogError: React.FC<DialogErrorType> = ({ message }) => {
  return (
    <CustomDialogContent>
      <LottieError />
      <DialogContentText
        id="dialog-error"
        variant="body1"
        align="center"
        color="error"
        margin="20px 0 0"
      >
        <span>
          { ERROR_MSG }
        </span>
        <br />
        <br />
        { message || 'No additional info.' }
      </DialogContentText>
    </CustomDialogContent>
  );

};
