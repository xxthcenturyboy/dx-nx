import React from 'react';

import {
  Box,
  DialogContent
} from '@mui/material';
import Dialog,
{
  DialogProps
} from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import { uiActions } from '../../store/ui-web.reducer';
import { LottieError } from '../../lottie/LottieError';
import { DialogWrapper } from './ui-wrapper.dialog';

export const DialogApiError: React.FC<Partial<DialogProps>> = (props) => {
  const open = useAppSelector((state: RootState) => state.ui.apiDialogOpen);
  const message = useAppSelector((state: RootState) => state.ui.apiDialogError);
  const dispatch = useAppDispatch();

  const closeDialog = (): void => {
    dispatch(uiActions.apiDialogSet(''));
  };

  return (
    <Dialog
      {
        ...{
          props,
          open,
          maxWidth: false,
          keepMounted: true,
          // keepMounted: false,
          // disableEnforceFocus: true,
          onBackdropClick: () => closeDialog(),
          onClose: () => closeDialog(),
        }
      }
    >
      <Box
        style={{
          padding: '10px 24px'
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
              overflow: 'visible'
            }}>
              {
                open && (<LottieError />)
              }
            <DialogContentText
              id="dialog-api-alert"
              variant="body1"
              align="center"
              color="error"
              margin="20px 0 0"
            >
              { message || 'Your request could not be completed.' }
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={closeDialog}
              variant="contained"
            >
              OK
            </Button>
          </DialogActions>
        </DialogWrapper>
      </Box>
    </Dialog>
  );

};
