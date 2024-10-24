import React from 'react';
import {
  Box,
  DialogContent
} from '@mui/material';
import Dialog,
{
  DialogProps
} from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';

import {
  useAppSelector
} from '@dx/utils-web-hooks';
import { selectIsMobileWidth } from '@dx/ui-web-system';
import { AwaiterLottie } from '@dx/ui-web-lottie';
import { DialogWrapper } from './ui-wrapper.dialog';

export const DialogAwaiter: React.FC<Partial<DialogProps>> = (props) => {
  const open = useAppSelector(state => state.ui.awaitDialogOpen);
  const message = useAppSelector(
    state => state.ui.awaitDialogMessage
  );
  const isMobileWidth = useAppSelector(state => selectIsMobileWidth(state));

  return (
    <Dialog
      {...{
        props,
        fullScreen: isMobileWidth,
        open,
        maxWidth: false,
        keepMounted: true,
        onBackdropClick: () => null,
        onClose: () => null,
      }}
    >
      <Box
        style={{
          padding: '10px 24px',
        }}
      >
        <DialogWrapper>
          {/* <DialogTitle style={{ textAlign: 'center' }} >{APP_NAME}</DialogTitle> */}
          <DialogContent
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
              minHeight: '300px',
              minWidth: '360px',
              overflow: 'visible',
            }}
          >
            {open && <AwaiterLottie />}
            <DialogContentText
              id="dialog-api-alert"
              variant="body1"
              align="center"
              color="default"
              margin="20px 0 0"
            >
              {message || 'Please Standby'}
            </DialogContentText>
          </DialogContent>
        </DialogWrapper>
      </Box>
    </Dialog>
  );
};
