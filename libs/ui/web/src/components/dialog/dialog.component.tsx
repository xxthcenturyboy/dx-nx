import React from 'react';
import { Box } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';

import {
  RootState,
  useAppDispatch,
  useAppSelector
} from '@dx/store-web';
import { uiActions } from '../../store/ui-web.reducer';

export const CustomDialog: React.FC<Partial<DialogProps>> = (props) => {
  const open = useAppSelector((state: RootState) => state.ui.dialogOpen);
  const body = useAppSelector((state: RootState) => state.ui.dialogComponent);
  const dispatch = useAppDispatch();

  const closeDialog = (): void => {
    dispatch(uiActions.appDialogSet(null));
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
          overflow: 'hidden',
          padding: '10px 24px'
        }}
      >
        { body }
      </Box>
    </Dialog>
  );

};
