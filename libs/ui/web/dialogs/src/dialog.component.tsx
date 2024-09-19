import React from 'react';
import { Box } from '@mui/material';
import Dialog, { DialogProps } from '@mui/material/Dialog';

import {
  RootState,
  store,
  useAppDispatch,
  useAppSelector,
} from '@dx/store-web';
import {
  selectIsMobileWidth,
  uiActions
} from '@dx/ui-web-system';

export const CustomDialog: React.FC<Partial<DialogProps>> = (props) => {
  const open = useAppSelector((state: RootState) => state.ui.dialogOpen);
  const body = useAppSelector((state: RootState) => state.ui.dialogComponent);
  const isMobileWidth = selectIsMobileWidth(store.getState());
  const dispatch = useAppDispatch();

  const closeDialog = (): void => {
    dispatch(uiActions.appDialogSet(null));
  };

  return (
    <Dialog
      {...{
        props,
        fullScreen: isMobileWidth,
        open,
        maxWidth: false,
        keepMounted: true,
        // keepMounted: false,
        // disableEnforceFocus: true,
        onBackdropClick: () => closeDialog(),
        onClose: () => closeDialog(),
      }}
    >
      <Box
        display={'flex'}
        justifyContent={'center'}
        padding={'10px 24px'}
        overflow={'hidden'}
      >
        {body}
      </Box>
    </Dialog>
  );
};
